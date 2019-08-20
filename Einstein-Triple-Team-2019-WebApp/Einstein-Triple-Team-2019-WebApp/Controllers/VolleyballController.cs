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
    public partial class VolleyballController : ControllerBase
    {
        private readonly IDbConnection dbConnection;

        public VolleyballController(IDbConnection dbConnection)
        {
            this.dbConnection = dbConnection;
        }


        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var teams = dbConnection.Query("GetVolleyBallGames", CommandType.StoredProcedure);

            return Ok(teams);
        }

        [HttpGet("leaderboard")]
        public async Task<IActionResult> GetTabelle()
        {
            var vbg = dbConnection.Query<VBG>("GetVolleyBallGames", CommandType.StoredProcedure);

            var tb = vbg
            .SelectMany(v => new[]
            {
                new { Team = v.Home, Games = 1, Wins = ((v.Set1PointsHome > v.Set1PointsGuest ? 1 : 0) + (v.Set2PointsHome > v.Set2PointsGuest ? 1 : 0)), Lose =((v.Set1PointsHome < v.Set1PointsGuest ? 1 : 0) + (v.Set2PointsHome < v.Set2PointsGuest ? 1 : 0)), OwnPoints = v.Set1PointsHome + v.Set2PointsHome, OtherPoints = v.Set1PointsGuest+v.Set2PointsGuest},
                new{ Team = v.Guest, Games = 1, Wins = ((v.Set1PointsHome < v.Set1PointsGuest ? 1 : 0) + (v.Set2PointsHome < v.Set2PointsGuest ? 1 : 0)), Lose =((v.Set1PointsHome > v.Set1PointsGuest ? 1 : 0) + (v.Set2PointsHome > v.Set2PointsGuest ? 1 : 0)), OwnPoints = v.Set1PointsGuest + v.Set2PointsGuest, OtherPoints  = v.Set1PointsHome+v.Set2PointsHome}
            })
            .GroupBy(v => v.Team)
            .Select(v => new { Team = v.Key, Games = v.Sum(l => l.Games), Wins = v.Sum(l => l.Wins), Lose = v.Sum(l => l.Lose), OwnPoints = v.Sum(l => l.OwnPoints), OtherPoints = v.Sum(l => l.OtherPoints) })
            .OrderByDescending(v => v.Wins)
            .ThenByDescending(v => v.OwnPoints)
            .ThenBy(v => v.OtherPoints)
            .ToList();

            return Ok(tb);
        }

    }
}