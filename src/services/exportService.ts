import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export class ExportService {
  // Exportar para PNG
  static async exportToPNG(element: HTMLElement, filename: string = 'diagram.png'): Promise<void> {
    try {
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
      });

      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Erro ao exportar PNG:', error);
      throw new Error('Falha ao exportar para PNG');
    }
  }

  // Exportar para PDF (com suporte a comentários)
  static async exportToPDF(
    element: HTMLElement,
    filename: string = 'diagram.pdf',
    comments?: string
  ): Promise<void> {
    try {
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const finalHeight = imgHeight > pageHeight - 20 ? pageHeight - 20 : imgHeight;

      // Página 1: diagrama
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, finalHeight);

      // Página 2: comentários (se houver)
      if (comments && comments.trim().length > 0) {
        pdf.addPage();
        pdf.setFontSize(18);
        pdf.text('Comentários', 14, 20);

        pdf.setFontSize(12);
        const splitText = pdf.splitTextToSize(comments.trim(), pageWidth - 28);
        pdf.text(splitText, 14, 35);
      }

      pdf.save(filename);
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      throw new Error('Falha ao exportar para PDF');
    }
  }


  // Exportar para PDF com metadados (simplificado)
  static async exportToPDFAdvanced(
    element: HTMLElement, 
    diagramData: any, 
    filename: string = 'diagram.pdf'
  ): Promise<void> {
    try {
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
      });

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      // Adiciona metadados
      pdf.setProperties({
        title: diagramData.metadata?.name || 'Diagrama UML',
        subject: 'Diagrama UML exportado do UMLDraw',
        author: 'UMLDraw Extension',
        keywords: 'uml, diagram, export',
        creator: 'UMLDraw VS Code Extension'
      });

      // Adiciona imagem do diagrama
      const imgData = canvas.toDataURL('image/png');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save(filename);
    } catch (error) {
      console.error('Erro ao exportar PDF avançado:', error);
      throw new Error('Falha ao exportar para PDF');
    }
  }

  // Exportar para SVG
  static async exportToSVG(element: HTMLElement, filename: string = 'diagram.svg'): Promise<void> {
    try {
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
      });

      const imgData = canvas.toDataURL('image/png');
      const svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
          <image href="${imgData}" width="${canvas.width}" height="${canvas.height}"/>
        </svg>
      `;

      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      const link = document.createElement('a');
      link.download = filename;
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Erro ao exportar SVG:', error);
      throw new Error('Falha ao exportar para SVG');
    }
  }
}