using MathNet.Numerics.LinearAlgebra;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace NeuralNet
{ 
    public class NNWrapper
    {
        private NeuralNetwork NN;                      

        public void LoadModel(string path)
        {            
            var str = File.ReadAllText(path);           
            var weights = Newtonsoft.Json.JsonConvert.DeserializeObject<Weights>(str);
            NN = new NeuralNetwork(weights);
        }

        public float[] Query(float[] inputs)
        {
            return NN.Query(inputs);
        }
    }
}
