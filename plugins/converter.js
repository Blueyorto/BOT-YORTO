'use strict';

const fs   = require('fs');
const os   = require('os');
const path = require('path');

module.exports = [

    {
    command: ['topdf'],
    aliases: ['pdf', 'makepdf', 'img2pdf', 'text2pdf'],
    description: 'Convert a quoted image or text to a PDF file',
    category: 'convert',
    handler: async (client, m, { reply, text }) => {
      const PDFDocument = require('pdfkit');

      const msgR     = m.message?.extendedTextMessage?.contextInfo?.quotedMessage || null;
      const imageMsg = msgR?.imageMessage || null;

      if (!imageMsg && !text) return reply(
        '📄 *Usage:*\n• Reply to an image: *.topdf*\n• Convert text: *.topdf Your text here*'
      );

      let imgFilePath;
      const pdfPath = path.join(os.tmpdir(), `pdf_${Date.now()}.pdf`);

      try {
        reply('⏳ Creating PDF...');
        const doc = new PDFDocument({ margin: 40, size: 'A4' });
        const ws  = fs.createWriteStream(pdfPath);
        doc.pipe(ws);

        if (imageMsg) {
          imgFilePath = await client.downloadAndSaveMediaMessage(imageMsg);
          if (!imgFilePath || !fs.existsSync(imgFilePath)) throw new Error('Download failed');
          const pageW = doc.page.width - 80;
          const pageH = doc.page.height - 80;
          doc.image(imgFilePath, 40, 40, { fit: [pageW, pageH], align: 'center', valign: 'center' });
        } else {
          doc.font('Helvetica').fontSize(12).text(text, { align: 'left', lineGap: 4 });
        }

        doc.end();
        await new Promise((resolve, reject) => { ws.on('finish', resolve); ws.on('error', reject); });

        await client.sendMessage(m.chat, {
          document: fs.readFileSync(pdfPath),
          mimetype: 'application/pdf',
          fileName: `document_${Date.now()}.pdf`,
          caption: '✅ *PDF created successfully!*',
        }, { quoted: m });

      } catch (err) {
        console.error('topdf error:', err.message);
        reply('❌ Failed to create PDF. Try again.');
      } finally {
        for (const p of [imgFilePath, pdfPath]) {
          if (p && fs.existsSync(p)) try { fs.unlinkSync(p); } catch (_) {}
        }
      }
    }
  },

    {
    command: ['toexcel'],
    aliases: ['excel', 'makeexcel', 'toxlsx', 'text2excel'],
    description: 'Convert comma-separated text to an Excel spreadsheet',
    category: 'convert',
    handler: async (client, m, { reply, text }) => {
      const XLSX = require('xlsx');

      const msgR       = m.message?.extendedTextMessage?.contextInfo?.quotedMessage || null;
      const quotedText = msgR?.conversation || msgR?.extendedTextMessage?.text || '';
      const inputText  = text || quotedText;

      if (!inputText?.trim()) return reply(
        '📊 *Usage:*\n*.toexcel Name,Age,City\\nJohn,25,NY\\nJane,30,LA*\n\n_Columns = commas, Rows = new lines_\n_Or reply to a text message with CSV data_'
      );

      const xlsxPath = path.join(os.tmpdir(), `excel_${Date.now()}.xlsx`);
      try {
        reply('⏳ Creating Excel file...');

        const lines = inputText.trim().split(/\n|\\n/).filter(l => l.trim());
        const data  = lines.map(line =>
          line.split(',').map(cell => {
            const t = cell.trim();
            const n = Number(t);
            return (!isNaN(n) && t !== '') ? n : t;
          })
        );

        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();

        // Auto column widths
        const colWidths = data.reduce((acc, row) => {
          row.forEach((cell, i) => { acc[i] = Math.max(acc[i] || 10, String(cell).length + 4); });
          return acc;
        }, []);
        ws['!cols'] = colWidths.map(w => ({ wch: w }));

        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, xlsxPath);

        await client.sendMessage(m.chat, {
          document: fs.readFileSync(xlsxPath),
          mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          fileName: `spreadsheet_${Date.now()}.xlsx`,
          caption: `✅ *Excel created!*\n📊 ${data.length} rows × ${data[0]?.length || 0} columns`,
        }, { quoted: m });

      } catch (err) {
        console.error('toexcel error:', err.message);
        reply('❌ Failed to create Excel. Make sure data is comma-separated.');
      } finally {
        if (fs.existsSync(xlsxPath)) try { fs.unlinkSync(xlsxPath); } catch (_) {}
      }
    }
  },

    {
    command: ['toword'],
    aliases: ['word', 'makedoc', 'todocx', 'img2word', 'text2word'],
    description: 'Convert a quoted image or text to a Word (.docx) file',
    category: 'convert',
    handler: async (client, m, { reply, text }) => {

      const { Document, Packer, Paragraph, TextRun, ImageRun, AlignmentType } = require('docx');

      const msgR     = m.message?.extendedTextMessage?.contextInfo?.quotedMessage || null;
      const imageMsg = msgR?.imageMessage || null;

      if (!imageMsg && !text) return reply(
        '📝 *Usage:*\n• Reply to an image: *.toword*\n• Convert text: *.toword Your text here*'
      );

      let imgFilePath;
      try {
        reply('⏳ Creating Word document...');
        let children = [];

        if (imageMsg) {
          imgFilePath = await client.downloadAndSaveMediaMessage(imageMsg);
          if (!imgFilePath || !fs.existsSync(imgFilePath)) throw new Error('Download failed');
          const imgBuffer = fs.readFileSync(imgFilePath);
          const ext = path.extname(imgFilePath).replace('.', '').toLowerCase() || 'jpeg';
          children.push(
            new Paragraph({
              children: [new ImageRun({ data: imgBuffer, transformation: { width: 500, height: 350 }, type: ext === 'png' ? 'png' : 'jpg' })],
              alignment: AlignmentType.CENTER,
            })
          );
        } else {
          for (const line of text.split('\n')) {
            children.push(
              line.trim()
                ? new Paragraph({ children: [new TextRun({ text: line.trim(), size: 24, font: 'Calibri' })], spacing: { after: 120 } })
                : new Paragraph({})
            );
          }
        }

        const doc = new Document({ sections: [{ properties: {}, children }] });
        const docBuffer = await Packer.toBuffer(doc);

        await client.sendMessage(m.chat, {
          document: docBuffer,
          mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          fileName: `document_${Date.now()}.docx`,
          caption: '✅ *Word document created successfully!*',
        }, { quoted: m });

      } catch (err) {
        console.error('toword error:', err.message);
        reply('❌ Failed to create Word document. Try again.');
      } finally {
        if (imgFilePath && fs.existsSync(imgFilePath)) try { fs.unlinkSync(imgFilePath); } catch (_) {}
      }
    }
  },

  ];
  
