using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using NeuralNet.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace NeuralNet.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private IHostingEnvironment hostingEnv;
        private NNWrapper nnw;

        public HomeController(ILogger<HomeController> logger, IHostingEnvironment env)
        {
            _logger = logger;
            this.hostingEnv = env;
            nnw = new NNWrapper();
            string path = Path.Combine(hostingEnv.WebRootPath) + @"/model/model.json";
            nnw.LoadModel(path);
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }     

        [HttpPost]
        public JsonResult Recognize([FromBody] ImageModel image)
        {
            var floats = image.Image.Select(x => x / 255.0f * 0.99f + 0.01f).ToArray();
            var answer = nnw.Query(floats);
            int label = Array.IndexOf(answer, answer.Max());

            Result result = new Result();
            result.Digit = label.ToString();
            return Json(result);
        }
    }
}
