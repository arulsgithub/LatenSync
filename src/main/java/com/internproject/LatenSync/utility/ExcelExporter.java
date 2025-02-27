package com.internproject.LatenSync.utility;
import com.internproject.LatenSync.entity.NetworkMetrics;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;
import java.util.List;
public class ExcelExporter {
    public static void exportToExcel(OutputStream outputStream, List<NetworkMetrics> metrics) throws IOException {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Metrics");

        // Create header row
        Row headerRow = sheet.createRow(0);
        headerRow.createCell(0).setCellValue("ID");
        headerRow.createCell(1).setCellValue("Device ID");
        headerRow.createCell(2).setCellValue("Latency");
        headerRow.createCell(3).setCellValue("Packet Loss");
        headerRow.createCell(4).setCellValue("Throughput");
        headerRow.createCell(5).setCellValue("Jitter");
        headerRow.createCell(6).setCellValue("Status");
        headerRow.createCell(7).setCellValue("Timestamp");

        // Create data rows
        int rowNum = 1;
        for (NetworkMetrics metric : metrics) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(metric.getId());
            row.createCell(1).setCellValue(metric.getDeviceId());
            row.createCell(2).setCellValue(metric.getLatency());
            row.createCell(3).setCellValue(metric.getPacket_loss());
            row.createCell(4).setCellValue(metric.getThroughput());
            row.createCell(5).setCellValue(metric.getJitter());
            row.createCell(6).setCellValue(metric.getStatus());
            row.createCell(7).setCellValue(metric.getTimestamp().toString());
        }

        // Write the workbook to the output stream
        workbook.write(outputStream);
        workbook.close();
    }
}