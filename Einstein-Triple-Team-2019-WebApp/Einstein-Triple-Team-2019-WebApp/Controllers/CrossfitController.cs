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

        [HttpGet("wod1")]
        public async Task<IActionResult> GetWod1()
        {
            var wod1 = dbConnection.Query("GetWod1", CommandType.StoredProcedure);

            var scoredTeam = wod1.Select(w => new { w.Name, w.Reps, w.Weight, w.SexMultiplier, Score = w.Reps * w.Weight * w.SexMultiplier }).OrderByDescending(w=> w.Score);

            return Ok(scoredTeam);
        }
    }
}