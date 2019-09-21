using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Einstein_Triple_Team_2019_WebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OverallController : ControllerBase
    {
        private readonly IDbConnection dbConnection;

        public OverallController(IDbConnection dbConnection)
        {
            this.dbConnection = dbConnection;
            //this.crossfitController = new CrossfitController(dbConnection);
        }

        class Overall
        {
            public string Team { get; set; }
            public int CF { get; set; }
            public int Boulder { get; set; }
            public int Volleyball { get; set; }
            public int Score{ get; set; }

        }

        private static int Sum(int s)
        {
            if(s == 0)
            {
                return 20;
            }
            return s;
        }

        [HttpGet]
        public async Task<IActionResult> OverallResult()
            {
            var cf = CrossfitController.CFLeaderBoard(dbConnection).OfType<dynamic>().Select(c => new Overall {Team = c.Name, CF = c.Place });
            var b = BoulderController.LB(dbConnection).OfType<dynamic>().Select(c => new Overall { Team = c.Team, Boulder = c.Place }); 
            var vb = VolleyballController.LB(dbConnection).OfType<dynamic>().Select(c => new Overall { Team = c.Team, Volleyball = c.Place });

            var oa = new List<Overall>();
            oa.AddRange(cf);
            oa.AddRange(b);
            oa.AddRange(vb);

            var g = oa.GroupBy(o => o.Team)
                .Select(o => new Overall { Team = o.Key, CF =Sum(o.Sum(oo => oo.CF)), Boulder = Sum(o.Sum(oo => oo.Boulder)), Volleyball = Sum(o.Sum(oo => oo.Volleyball)), Score = Sum(o.Sum(oo => oo.CF))+ Sum(o.Sum(oo => oo.Boulder))+ Sum(o.Sum(oo => oo.Volleyball)) } ).OrderBy(a => a.Score);


            return Ok(g);
            }
    }
}