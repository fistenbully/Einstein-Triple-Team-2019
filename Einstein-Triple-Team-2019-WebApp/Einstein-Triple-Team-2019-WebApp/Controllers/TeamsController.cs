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
    public class TeamsController : ControllerBase
    {
        private readonly IDbConnection dbConnection;

        public TeamsController(IDbConnection dbConnection)
        {
            this.dbConnection = dbConnection;
        }

        // GET: api/Teams
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var teams = dbConnection.Query("GetAllTeams", CommandType.StoredProcedure);

            return Ok(teams);
        }

        // GET: api/Teams/5
        [HttpGet("{id}", Name = "Get")]
        public async Task<IActionResult> Get(Guid id)
        {
            var para = new DynamicParameters();
            para.Add("@Id", id);

            var team = dbConnection.Query("GetTeamById", param: para, commandType: CommandType.StoredProcedure);

            return Ok(team);
        }
    }
}
