using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Einstein_Triple_Team_2019_WebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CrossfitController : ControllerBase
    {
        private readonly IDbConnection dbConnection;

        public CrossfitController(IDbConnection dbConnection)
        {
            this.dbConnection = dbConnection;
        }

        [HttpGet("wod/{teamId}")]
        public async Task<IActionResult> GetWod1ForTeam(Guid teamId)
        {
            var para = new DynamicParameters();
            para.Add("@Id", teamId);

            var team = dbConnection.Query("GetTeamById", param: para, commandType: CommandType.StoredProcedure).FirstOrDefault();

            var w1 = GetWods1(dbConnection);
            dynamic teamResult1 = w1.FirstOrDefault(w => ((dynamic)w).Name == team.Name);

            var w2 = GetWods2(dbConnection);
            dynamic teamResult2 = w2.FirstOrDefault(w => ((dynamic)w).Name == team.Name);

            var w3 = GetWods3(dbConnection);
            dynamic teamResult3 = w3.FirstOrDefault(w => ((dynamic)w).Name == team.Name);

            return Ok(new[] { teamResult1, teamResult2, teamResult3 });
        }

        private static IEnumerable<object> GetWods1(IDbConnection dbConnection)
        {
            var wod1 = dbConnection.Query("GetWod1", CommandType.StoredProcedure);

            return wod1
                  .Select(w => new { w.Name, w.Reps, w.Weight, w.SexMultiplier, Score = w.Reps * w.Weight * w.SexMultiplier })
    .GroupBy(w => w.Score)
    .OrderByDescending(w => w.Key)
    .SelectMany((w2, i) => w2.Select(w => new { w.Name, w.Reps, w.Score, w.SexMultiplier, Place = i + 1, w.Weight, Wod = "1" }));
        }

        private static IEnumerable<object> GetWods3(IDbConnection dbConnection)
        {
            var maxReps = 300;
            return dbConnection.Query("GetWod3", CommandType.StoredProcedure)
        .Select(w => new { w.Name, w.Reps, w.SexMultiplier, Time = TimeSpan.FromTicks(w.Time), Score = w.Reps == 0 ? TimeSpan.FromTicks((long)(w.Time * w.SexMultiplier)) : TimeSpan.FromTicks((long)(w.Time * w.SexMultiplier)) + TimeSpan.FromTicks((long)((new TimeSpan(0, 0, (int)(1 * (maxReps - w.Reps)))).Ticks * w.SexMultiplier)) })
    .GroupBy(w => w.Score)
    .OrderBy(w => w.Key)
    .SelectMany((w2, i) => w2.Select(w => new { w.Name, w.Reps, w.Score, w.SexMultiplier, w.Time, Place = i + 1, Wod = "3" }));
        }

        private static IEnumerable<object> GetWods2(IDbConnection dbConnection)
        {
            var maxReps = 395;
            return dbConnection.Query("GetWod2", CommandType.StoredProcedure)
             .Select(w => new { w.Name, w.Reps, w.SexMultiplier, Time = TimeSpan.FromTicks(w.Time), Score = w.Reps == 0 ? TimeSpan.FromTicks((long)(w.Time* w.SexMultiplier)) : TimeSpan.FromTicks((long)(w.Time * w.SexMultiplier)) + TimeSpan.FromTicks((long)((new TimeSpan(0, 0, (int)(1 * (maxReps - w.Reps)))).Ticks * w.SexMultiplier)) })
        .GroupBy(w => w.Score)
    .OrderBy(w => w.Key)
    .SelectMany((w2, i) => w2.Select(w => new { w.Name, w.Reps, w.Score, w.SexMultiplier, w.Time, Place = i + 1, Wod = "2" }));
        }

        [HttpGet("wod3")]
        public async Task<IActionResult> GetWod3()
        {
            var scoredTeam = GetWods3(dbConnection);

            return Ok(scoredTeam);
        }

        [HttpGet("wod2")]
        public async Task<IActionResult> GetWod2()
        {
            var scoredTeam = GetWods2(dbConnection);

            return Ok(scoredTeam);
        }

        [HttpGet("wod1")]
        public async Task<IActionResult> GetWod1()
        {
            var scoredTeam = GetWods1(dbConnection);

            return Ok(scoredTeam);
        }

        public static IEnumerable<object> CFLeaderBoard(IDbConnection dbConnection)
        {
            var wod1 = GetWods1(dbConnection);
            var wod2 = GetWods2(dbConnection);
            var wod3 = GetWods3(dbConnection);

            var wodList = new List<object>();
            wodList.AddRange(wod1.Select(w => new { ((dynamic)w).Name, ((dynamic)w).Place, ((dynamic)w).Score }));
            wodList.AddRange(wod2.Select(w => new { ((dynamic)w).Name, ((dynamic)w).Place, ((dynamic)w).Score }));
            wodList.AddRange(wod3.Select(w => new { ((dynamic)w).Name, ((dynamic)w).Place, ((dynamic)w).Score }));

            var grouped = wodList.GroupBy(l => ((dynamic)l).Name);
            var gw = grouped
            .Select(g => new { Name = g.Key, Details = g.ToList(), Score = g.ToList().Sum(s => ((dynamic)s).Place) })
            .OrderBy(g => g.Score)
            .Select((g, i) => new { g.Name, g.Details, g.Score, Place = i + 1 });

            return gw;
        }

        [HttpGet("leaderboard")]
        public async Task<IActionResult> GetLeaderboard()
        {
            return Ok(CFLeaderBoard(dbConnection));
        }
    }
}