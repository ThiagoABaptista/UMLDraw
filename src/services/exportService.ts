declare global {
  interface Window {
    html2canvas: any;
    jspdf: any;
  }
}

export class ExportService {
  // Exportar para PNG
  static async exportToPNG(element: HTMLElement, filename: string = 'diagram.png'): Promise<void> {
    try {
      if (!window.html2canvas) {
        throw new Error('html2canvas não está disponível');
      }

      const canvas = await window.html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true
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

  // Exportar para PDF
  static async exportToPDF(element: HTMLElement, filename: string = 'diagram.pdf'): Promise<void> {
    try {
      if (!window.html2canvas || !window.jspdf) {
        throw new Error('Dependências de exportação não estão disponíveis');
      }

      const canvas = await window.html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new window.jspdf.jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 280;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save(filename);
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      throw new Error('Falha ao exportar para PDF');
    }
  }

  // Exportar para PDF com metadados
  static async exportToPDFAdvanced(
    element: HTMLElement, 
    diagramData: any, 
    filename: string = 'diagram.pdf'
  ): Promise<void> {
    try {
      if (!window.html2canvas || !window.jspdf) {
        throw new Error('Dependências de exportação não estão disponíveis');
      }

      const canvas = await window.html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true
      });

      const pdf = new window.jspdf.jsPDF({
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
      const imgWidth = 280;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);

      // Adiciona página de metadados
      pdf.addPage();
      pdf.setFontSize(16);
      pdf.text('Metadados do Diagrama', 20, 20);
      
      pdf.setFontSize(12);
      const metadata = [
        ['Nome:', diagramData.metadata?.name || 'N/A'],
        ['Tipo:', diagramData.metadata?.type || 'N/A'],
        ['Criado:', diagramData.metadata?.created ? new Date(diagramData.metadata.created).toLocaleString() : 'N/A'],
        ['Modificado:', diagramData.metadata?.lastModified ? new Date(diagramData.metadata.lastModified).toLocaleString() : 'N/A'],
        ['Elementos:', diagramData.elements.length.toString()],
        ['Relacionamentos:', diagramData.relationships.length.toString()]
      ];

      // Usa autotable se disponível
      if ((window.jspdf as any).autoTable) {
        (window.jspdf as any).autoTable({
          startY: 30,
          head: [['Propriedade', 'Valor']],
          body: metadata,
          theme: 'grid'
        });
      } else {
        // Fallback manual
        let y = 30;
        metadata.forEach(([prop, value]) => {
          pdf.text(`${prop} ${value}`, 20, y);
          y += 10;
        });
      }

      pdf.save(filename);
    } catch (error) {
      console.error('Erro ao exportar PDF avançado:', error);
      throw new Error('Falha ao exportar para PDF');
    }
  }

  // Exportar para SVG (opcional)
  static async exportToSVG(element: HTMLElement, filename: string = 'diagram.svg'): Promise<void> {
    try {
      if (!window.html2canvas) {
        throw new Error('html2canvas não está disponível');
      }

      const canvas = await window.html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true
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