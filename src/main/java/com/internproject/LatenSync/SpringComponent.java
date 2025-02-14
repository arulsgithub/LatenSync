package com.internproject.LatenSync;

import com.internproject.LatenSync.service.DataCollectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class SpringComponent {

    @Autowired
    DataCollectionService dataCollectionService;

    public void func() throws Exception {
        dataCollectionService.collectMetrics("F16ST");
    }

//    public void func() throws IOException {
//        Process process = Runtime.getRuntime().exec("ping -n 5 76.76.19.19");
//        BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(process.getInputStream()));
//        String line;
//        StringBuilder output = new StringBuilder();
//        while (bufferedReader.readLine() != null) {
//            line = bufferedReader.readLine();
//            output.append(line).append("\n");
//        }
//        String pingOutput = output.toString();
//        System.out.println(pingOutput);
//        Pattern packetLossPattern = Pattern.compile("Lost = \\d+ \\((\\d+)% loss\\)");
//        Matcher packetLossMatcher = packetLossPattern.matcher(pingOutput);
//        String packetLoss = packetLossMatcher.find() ? packetLossMatcher.group(1) : "N/A";
//
//        Pattern latencyPattern = Pattern.compile("Minimum = (\\d+)ms, Maximum = (\\d+)ms, Average = (\\d+)ms");
//        Matcher latencyMatcher = latencyPattern.matcher(pingOutput);
//
//        String latencyMin = "N/A", latencyMax = "N/A", latencyAvg = "N/A";
//        if (latencyMatcher.find()) {
//            latencyMin = latencyMatcher.group(1);
//            latencyMax = latencyMatcher.group(2);
//            latencyAvg = latencyMatcher.group(3);
//        }
//
//        System.out.println("Packet Loss: " + packetLoss + "%");
//        System.out.println("Latency - Min: " + latencyMin + "ms, Max: " + latencyMax + "ms, Avg: " + latencyAvg + "ms");
//    }
}
