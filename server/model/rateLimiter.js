// Ratelimit based on slider window strategy
export default function PrismaAdapter(p) {
  return {
    // force reset limiter , may nerver use :v
    resetLimiter: (ip) =>
      p.IpRateLimit.update({
        where: {
          ipAddress: ip,
        },
        data: {
          totalHits: 1,
          createdTime: new Date(),
        },
      }),

    /**
     *
     * @param {String} ip user ip address
     * @param {int} maxHits max requests in a given time
     * @param {int} timeLimit in ms
     * @returns {(object|null)} 
     */
    validateIp: async (ip, maxHits, timeLimit) => {

      let rateLimiter = await p.IpRateLimit.upsert({
        where: {
          ipAddress: ip,
        },
        update: {
          totalHits: {
            increment: 1,
          },
        },
        create: {
          ipAddress: ip,
        },
      });
      // Limited then return null
      if (
        rateLimiter.createdTime > (new Date(Date.now() - timeLimit)) &&
        rateLimiter.totalHits > maxHits
      )
        return null;
      // Pass limit time then reset limit and return
      if (rateLimiter.createdTime < (new Date(Date.now() - timeLimit))) {
        await p.IpRateLimit.update({
          where: {
            ipAddress: ip,
          },
          data: {
            totalHits: 1,
            createdTime: new Date(),
          },
        });
      }
      return rateLimiter;

    },
    // cleanup limiter  **** Should run as cron job ****
    cleanUpLimiter: (timeLimit) =>
      p.IpRateLimit.deleteMany({
        where: {
          createdTime: {
            lte: new Date(Date.now() - timeLimit),
          },
        },
      }),
  };
}
