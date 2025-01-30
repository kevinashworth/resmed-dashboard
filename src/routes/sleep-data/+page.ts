import type { PageLoad } from "./$types";
import { error } from "@sveltejs/kit";

export const load: PageLoad = async ({ fetch }) => {
  try {
    const months: string[] = Object.values(
      import.meta.glob("/src/data/monthlySleepRecords/*.json", {
        eager: true,
        query: "?url",
        import: "default",
      }),
    );
    const allData = await Promise.all(
      months.map(async (month) => {
        const response = await fetch(month);
        if (!response.ok) {
          throw new Error(`Failed to load data for ${month}`);
        }
        return response.json();
      }),
    );

    const combinedData = allData.flatMap((monthData) => monthData.data.getPatientWrapper.sleepRecords.items);

    // Transform data for the chart
    const chartData = combinedData.flatMap((record) => [
      {
        group: "Leak Percentile",
        date: new Date(record.startDate),
        value: record.leakPercentile,
      },
      {
        group: "Leak Score",
        date: new Date(record.startDate),
        value: record.leakScore,
      },
      {
        group: "Mask Pair Count",
        date: new Date(record.startDate),
        value: record.maskPairCount,
      },
      {
        group: "Mask Score",
        date: new Date(record.startDate),
        value: record.maskScore,
      },
      {
        group: "Sleep Score",
        date: new Date(record.startDate),
        value: record.sleepScore,
      },
      {
        group: "Total Usage",
        date: new Date(record.startDate),
        value: record.totalUsage,
      },
      {
        group: "Usage Score",
        date: new Date(record.startDate),
        value: record.usageScore,
      },
    ]);

    const leakPercentileData = chartData.filter((item) => item.group === "Leak Percentile");
    const leakScoreData = chartData.filter((item) => item.group === "Leak Score");
    const maskPairCountData = chartData.filter((item) => item.group === "Mask Pair Count");
    const maskScoreData = chartData.filter((item) => item.group === "Mask Score");
    const sleepScoreData = chartData.filter((item) => item.group === "Sleep Score");
    const totalUsageData = chartData.filter((item) => item.group === "Total Usage");
    const usageScoreData = chartData.filter((item) => item.group === "Usage Score");

    return {
      sleepData: chartData,
      leakPercentileData,
      leakScoreData,
      maskPairCountData,
      maskScoreData,
      sleepScoreData,
      totalUsageData,
      usageScoreData,
    };
  } catch (err) {
    console.error("Error loading sleep data:", err);
    throw error(500, "Failed to load sleep data");
  }
};
