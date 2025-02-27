package com.internproject.LatenSync.utility;
import com.internproject.LatenSync.entity.NetworkMetrics;
import com.opencsv.CSVWriter;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

public class CsvExporter {
    public static void exportToCsv(PrintWriter writer, List<NetworkMetrics> metrics) {
        try (CSVWriter csvWriter = new CSVWriter(writer)) {
            // Write CSV header
            csvWriter.writeNext(new String[]{
                    "ID", "Device ID", "Latency", "Packet Loss", "Throughput", "Jitter", "Status", "Timestamp"
            });

            // Write data rows
            for (NetworkMetrics metric : metrics) {
                csvWriter.writeNext(new String[]{
                        metric.getId().toString(),
                        metric.getDeviceId(),
                        String.valueOf(metric.getLatency()),
                        String.valueOf(metric.getPacket_loss()),
                        String.valueOf(metric.getThroughput()),
                        String.valueOf(metric.getJitter()),
                        metric.getStatus(),
                        metric.getTimestamp().toString()
                });
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to export metrics to CSV", e);
        }
    }
}
