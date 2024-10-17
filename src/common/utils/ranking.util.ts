export class RankingUtil {
  public static getRanking(
    idCountMap: Map<number, number>,
  ): Map<number, number> {
    const entries = Array.from(idCountMap.entries());
    entries.sort((a, b) => b[1] - a[1]); // Sort by count descending

    const totalEntries = entries.length;
    const percentileMap = new Map<number, number>();

    let currentRank = 0;
    let currentCount = null;
    let startRank = 1;

    for (let i = 0; i < totalEntries; i++) {
      const [id, count] = entries[i];

      if (count !== currentCount) {
        currentRank = i + 1;
        startRank = currentRank;
        currentCount = count;
      }

      // Calculate percentile and map it
      const percentile = Math.floor((startRank / totalEntries) * 100);
      percentileMap.set(id, percentile > 0 ? percentile : 1);
    }

    return percentileMap;
  }
}
