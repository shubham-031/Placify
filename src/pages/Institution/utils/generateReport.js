import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Chart } from "chart.js/auto";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// ---- Generate chart as image in browser ----
async function generateChartImage(data, type) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  let labels = [];
  let values = [];

  if (type === "Comparison") {
    // Use comparison data only
    labels = data.comparison.map((d) => d.dept);
    values = data.comparison.map((d) =>
      ((d.placed / (d.total || d.placed)) * 100).toFixed(2)
    );
  } else {
    // Use full department summary
    labels = data.departmentSummary.map((d) => d.dept);
    values = data.departmentSummary.map((d) =>
      ((d.placed / d.total) * 100).toFixed(2)
    );
  }

  new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Placement %",
          data: values,
          backgroundColor: "rgba(54, 162, 235, 0.6)",
        },
      ],
    },
    options: {
      responsive: false,
      animation: false,
      plugins: {
        legend: { display: false },
      },
    },
  });

  return canvas.toDataURL("image/png");
}


// ---- Generate PDF Report ----
export const generatePDFReport = async (type, filters, data) => {
  const profile = {
    name: "Vishwakarma Institute of Technology",
    website: "https://vishwakarma.edu.in",
    contactPerson: "Admin",
    email: "info@example.com",
  };

  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.text(profile.name, 14, 20);
  doc.setFontSize(11);
  doc.text(`Website: ${profile.website}`, 14, 28);
  doc.text(`Contact: ${profile.contactPerson} | Email: ${profile.email}`, 14, 34);
  doc.line(10, 38, 200, 38);

  doc.setFontSize(13);
  doc.text(`Report Type: ${type}`, 14, 44);
  doc.text(`Filters: ${JSON.stringify(filters)}`, 14, 50);

  // Table
  let head = [];
  let tableData = [];

  if (type === "Full") {
    head = [["Dept", "Total", "Placed", "Placement %", "Avg Package", "Top Package", "Companies"]];
    tableData = data.departmentSummary?.map((d) => [
      d.dept,
      d.total,
      d.placed,
      `${((d.placed / d.total) * 100).toFixed(2)}%`,
      d.avgPackage,
      d.topPackage,
      d.companies,
    ]) || [];
  } else if (type === "Department") {
    const d = data.selectedDepartmentData;
    head = [["Department", "Total", "Placed", "Placement %", "Avg Package", "Top Package", "Companies"]];
    tableData = d
      ? [[d.dept, d.total, d.placed, `${((d.placed / d.total) * 100).toFixed(2)}%`, d.avgPackage, d.topPackage, d.companies]]
      : [];
  } else if (type === "Comparison") {
    head = [["Department", "Placed", "Avg Package", "Top Package"]];
    tableData = data.comparison?.map((d) => [d.dept, d.placed, d.avgPackage, d.topPackage]) || [];
  }

  if (!tableData.length) {
    doc.text("No Data Available", 14, 70);
    doc.save("placement-report.pdf");
    return;
  }

  // AutoTable
  const tableResult = autoTable(doc, {
    head,
    body: tableData,
    startY: 60,
    styles: { halign: "center" },
    headStyles: { fillColor: [41, 128, 185] },
    alternateRowStyles: { fillColor: [245, 245, 245] },
  });

  const finalY = tableResult?.finalY || doc.lastAutoTable?.finalY || 70;

  // Chart
  const chartImage = await generateChartImage(data, type);
  doc.addImage(chartImage, "PNG", 15, finalY + 10, 180, 80);

  // Footer
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 290);

  doc.save("placement-report.pdf");
};


// ---- Generate Excel Report ----
export const generateExcelReport = (type, filters, data) => {
  let sheetData = [];

  if (type === "Full") {
    sheetData = [["Dept", "Total", "Placed", "Placement %", "Avg Package", "Top Package", "Companies"]];
    data.departmentSummary.forEach((d) => {
      sheetData.push([
        d.dept,
        d.total,
        d.placed,
        `${((d.placed / d.total) * 100).toFixed(2)}%`,
        d.avgPackage,
        d.topPackage,
        d.companies,
      ]);
    });
  } else if (type === "Department") {
    const d = data.selectedDepartmentData;
    sheetData = [
      ["Department", "Total", "Placed", "Placement %", "Avg Package", "Top Package", "Companies"],
      [
        d.dept,
        d.total,
        d.placed,
        `${((d.placed / d.total) * 100).toFixed(2)}%`,
        d.avgPackage,
        d.topPackage,
        d.companies,
      ],
    ];
  } else if (type === "Comparison") {
    sheetData = [["Department", "Placed", "Avg Package", "Top Package"]];
    data.comparison.forEach((d) => {
      sheetData.push([d.dept, d.placed, d.avgPackage, d.topPackage]);
    });
  }

  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(dataBlob, "placement-report.xlsx");
};
