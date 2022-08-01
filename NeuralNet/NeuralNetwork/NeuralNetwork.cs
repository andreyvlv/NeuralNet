using System;
using MathNet.Numerics.Distributions;
using MathNet.Numerics.LinearAlgebra;

namespace NeuralNet
{
    public class NeuralNetwork
    {        
        // link weight matrices, wih and who
        // weights inside the arrays are w_i_j, where link is from node i to node j in the next layer
        // w11 w21
        // w12 w22 etc        
        public Matrix<float> _WIH;
        public Matrix<float> _WHO;            

        public NeuralNetwork(Weights weights)
        {
            _WIH = Matrix<float>.Build.DenseOfColumnArrays(weights.WIH);
            _WHO = Matrix<float>.Build.DenseOfColumnArrays(weights.WHO);
        }

        public float[] Query(float[] inputsList)
        {
            Matrix<float> inputs = Vector<float>.Build.Dense(inputsList).ToColumnMatrix();

            var hiddenInputs = _WIH * inputs;
            var hiddenOutputs = hiddenInputs.Map(x => Sigmoid(x));

            var finalInputs = _WHO * hiddenOutputs;
            var finalOutputs = finalInputs.Map(x => Sigmoid(x));
          
            return finalOutputs.ToColumnMajorArray();            
        }            

        // Sigmoid function for node activation. 
        private float Sigmoid(float x)
        {
            return 1/(1 + MathF.Exp(-1 * x));
        }

        public Weights GetWeights()
        {
            return new Weights(_WIH, _WHO);
        }
    }

    public class Weights
    {      
        public float[][] WIH { get; set; }
        public float[][] WHO { get; set; }

        public Weights()
        {

        }

        public Weights(Matrix<float> wIH, Matrix<float> wHO)
        {            
            WIH = wIH.ToColumnArrays();
            WHO = wHO.ToColumnArrays();

        }
    }
}