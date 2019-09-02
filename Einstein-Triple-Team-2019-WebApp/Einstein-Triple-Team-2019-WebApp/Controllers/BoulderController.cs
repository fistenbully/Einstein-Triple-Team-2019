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
    public class BoulderController : ControllerBase
    {
        private readonly IDbConnection dbConnection;

        public BoulderController(IDbConnection dbConnection)
        {
            this.dbConnection = dbConnection;
        }

        [HttpGet]
        public async Task<IActionResult> ByTeamId()
        {
            var vbg = dbConnection.Query("GetAllBoulder", commandType: CommandType.StoredProcedure);

            return Ok(vbg);
        }


        [HttpGet("{teamId}")]
        public async Task<IActionResult> ByTeamId(Guid teamId)
        {
            var para = new DynamicParameters();
            para.Add("@TeamId", teamId);
            var vbg = dbConnection.Query("GetBoulderByTeamId", para, commandType: CommandType.StoredProcedure);

            var b = vbg.Select(v => new { v.TeamName, v.BoulderName, Flash = v.Flash ? 1 : 0, Top = v.Top ? 1 :0, Points = v.Flash ? 15 : 10}).ToList();

            return Ok(b);
        }

        [HttpGet("leaderboard")]
        public async Task<IActionResult> GetTabelle()
        {
            var vbg = dbConnection.Query("GetAllBoulderScores", CommandType.StoredProcedure);

            var b = vbg
            .Select(v => new { Team = v.TeamName, Boulder = v.BoulderName, Flash = v.Flash ? 1 : 0, Top = v.Top ? 1 : 0 })
            .GroupBy(v => v.Team)
            .Select(v => new { Team = v.Key, Points = v.Sum(l => l.Flash * 15 + l.Top * 10), Flash = v.Sum(l => l.Flash), Top = v.Sum(l => l.Top) })
            .OrderByDescending(v => v.Points)
            .ThenByDescending(v => v.Flash)
            .Select((v, i) => new { v.Team, v.Flash, v.Top, v.Points, Place = i+1 })
            .ToList();

            return Ok(b);
        }
    }
}