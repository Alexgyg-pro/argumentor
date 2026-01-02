// src/utils/pdfUtils.js
import { pdf } from "@react-pdf/renderer";
import { PdfDocument } from "../components/pdf/PdfDocument";
export const generatePdf = async (data) => {
  try {
    // Créer le blob PDF
    const blob = await pdf(<PdfDocument {...data} />).toBlob();

    // Télécharger
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;

    // Nom du fichier basé sur la thèse
    const fileName = data.thesis
      ? `argumentaire-${data.thesis
          .substring(0, 30)
          .replace(/[^a-z0-9]/gi, "-")}.pdf`
      : `argumentaire-${new Date().toISOString().slice(0, 10)}.pdf`;

    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log("✅ PDF généré avec succès");
  } catch (error) {
    console.error("❌ Erreur lors de la génération du PDF:", error);
    alert(`Erreur lors de la génération du PDF: ${error.message}`);
  }
};
