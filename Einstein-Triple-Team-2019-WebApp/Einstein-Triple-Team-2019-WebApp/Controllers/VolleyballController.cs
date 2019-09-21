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

        [HttpGet("{teamId}")]
        public async Task<IActionResult> GamesByTeamId(Guid teamId)
        {
            var para = new DynamicParameters();
            para.Add("@TeamId", teamId);

            var vbg = dbConnection.Query<VBG>("GetVolleyballGamesByTeam", para, commandType: CommandType.StoredProcedure);

            return Ok(vbg.Select(v => new { v.Home, v.Guest, SetOne = $"{v.Set1PointsHome} : {v.Set1PointsGuest}", SetTwo = $"{v.Set2PointsHome} : {v.Set2PointsGuest}" }));
        }

        public static IEnumerable< object> LB(IDbConnection dbConnection)
        {
            var vbg = dbConnection.Query<VBG>("GetVolleyBallGames", CommandType.StoredProcedure);
            var sets = 2;
            var tb = vbg
            .SelectMany(v => new[]
            {
                new { Team = v.Home, Games = 1, OwnPoints = v.Set1PointsHome + v.Set2PointsHome, OtherPoints = v.Set1PointsGuest+v.Set2PointsGuest , SexMultiplier = v.HomeSex},
                new{ Team = v.Guest, Games = 1, OwnPoints = v.Set1PointsGuest + v.Set2PointsGuest, OtherPoints  = v.Set1PointsHome+v.Set2PointsHome, SexMultiplier = v.GuestSex}
            })
            .Select(v => new { v.Team, v.Games, v.OtherPoints, v.OwnPoints, Score = v.OwnPoints * v.SexMultiplier })
            .GroupBy(v => v.Team)
            .Select(v => new { Team = v.Key, Games = v.Sum(l => l.Games), Score = v.Sum(l => l.Score), OwnPoints = v.Sum(l => l.OwnPoints), OtherPoints = v.Sum(l => l.OtherPoints) })
            .OrderByDescending(v => v.Score)
            .ThenBy(v => v.OtherPoints)
            .Select((v, i) => new { v.Team, v.Games, v.Score, v.OwnPoints, v.OtherPoints, Place = i + 1 })
            .ToList();


            return tb;
        }

        [HttpGet("leaderboard")]
        public async Task<IActionResult> GetTabelle()
        {
            var tb = LB(dbConnection);

            return Ok(tb);
        }

    }
}