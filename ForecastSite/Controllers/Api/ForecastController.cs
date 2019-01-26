using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ForecastSite.Dtos;

namespace ForecastSite.Controllers.Api
{
    public class ForecastController : ApiController
    {
        [HttpGet]
        public IHttpActionResult GetForecast()
        {
            var x = new ForecastLogDto()
            {
                Test = "testwaarde"
            };
            return Ok(x);
        }


        [HttpPost]
        [Route("api/log")]
        public IHttpActionResult LogRequest(ForecastLogDto dto)
        {
            return Ok();
        }
    }
}
