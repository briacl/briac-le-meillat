import React from 'react';
import ResearchDetail from './ResearchDetail';
import Latex from 'react-latex-next';

export default function OptimisationNeurones() {
    return (
        <ResearchDetail
            title="L'optimisation des réseaux de neurones"
            subtitle="Exploration des méthodes de descente de gradient et de leurs variantes adaptatives."
            date="2024"
            content={
                <div className="space-y-6">
                    <p>
                        L'optimisation des réseaux de neurones est au cœur de l'apprentissage profond. 
                        L'objectif principal est de minimiser une fonction de perte $L(\\theta)$ par rapport aux paramètres $\\theta$ du modèle.
                    </p>

                    <h3 className="text-2xl font-['Paris2024'] text-[#00f2ff] mt-8 mb-4">Descente de Gradient Stochastique (SGD)</h3>
                    <p>
                        La mise à jour standard des poids se fait selon la formule :
                    </p>
                    <div className="my-6 p-6 bg-white/5 rounded-xl border border-white/10 overflow-x-auto text-center">
                        <Latex>
                            {`$$\\theta_{t+1} = \\theta_t - \\eta \\cdot \\nabla_\\theta J(\\theta_t)$$`}
                        </Latex>
                    </div>
                    <p>
                        Où $\\eta$ est le taux d'apprentissage. Cependant, cette méthode peut être lente et coincée dans des minimums locaux.
                    </p>

                    <h3 className="text-2xl font-['Paris2024'] text-[#00f2ff] mt-8 mb-4">Adam (Adaptive Moment Estimation)</h3>
                    <p>
                        Adam combine les avantages de AdaGrad et RMSProp. Il calcule des moyennes mobiles exponentielles du gradient et de son carré :
                    </p>
                    <div className="my-6 p-6 bg-white/5 rounded-xl border border-white/10 overflow-x-auto text-center text-lg">
                        <Latex>
                            {`$$m_t = \\beta_1 m_{t-1} + (1 - \\beta_1) g_t$$`}
                        </Latex>
                        <br />
                        <Latex>
                            {`$$v_t = \\beta_2 v_{t-1} + (1 - \\beta_2) g_t^2$$`}
                        </Latex>
                    </div>
                    <p>
                        Ces moments sont ensuite utilisés pour mettre à jour les paramètres, offrant une convergence souvent plus rapide et stable.
                    </p>
                </div>
            }
        />
    );
}
