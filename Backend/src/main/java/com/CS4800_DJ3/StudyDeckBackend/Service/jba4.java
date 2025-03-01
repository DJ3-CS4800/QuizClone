package com.CS4800_DJ3.StudyDeckBackend.Service;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.apache.commons.math3.stat.descriptive.DescriptiveStatistics;


import java.io.IOException;

public class jba4 {

    public static void main(String[] args) {

        Document doc;
        try {

            // need http protocol
            doc = Jsoup.connect("http://google.com").get();

            // get page title
            String title = doc.title();
            System.out.println("title : " + title);

            // get all links
            Elements links = doc.select("a[href]");
            for (Element link : links) {

                // get the value from href attribute
                System.out.println("\nlink : " + link.attr("href"));
                System.out.println("text : " + link.text());

            }

        } catch (IOException e) {
            e.printStackTrace();
        }

    }
public static void main1 (String [] args)
{
    DescriptiveStatistics stats = new DescriptiveStatistics();
    double [] array = {1, 2, 3};
    for(int i = 0; i < 3; i++)
    {
        stats.addValue(array[i]);
    }
    System.out.println("Mean " + stats.getMean());
}


}
