// import { toast } from "react-toastify";
import generatePDF from 'react-to-pdf';

// export function saveToPdf(pdfView, fileName) {
//     var opt = {
//         margin: 0.01,
//         filename: fileName,
//         image: { type: "jpg", quality: 0.95 },
//         html2canvas: { scale: 1, useCORS: true },
//         jsPDF: { unit: "mm", format: "letter", orientation: "portrait" },
//     };
//     window.html2pdf(pdfView.current, opt)
//         .then(() => {
//             toast.success("PDF Downloaded Successfully!")
//         })
//     // html2pdf().set(opt).from(this.$refs.document).save()
// }

export function saveToPdf(pdfView, fileName) {
    generatePDF(pdfView, { filename: fileName })
}