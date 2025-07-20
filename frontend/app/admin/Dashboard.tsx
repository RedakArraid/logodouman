import { useEffect, useState } from 'react';
import { ChartBarIcon, CubeIcon, TagIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Dashboard({ token }: { token: string }) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:4002/api/dashboard', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(e => {
        setError('Erreur lors du chargement des statistiques');
        setLoading(false);
      });
  }, [token]);

  if (loading) return <div className="py-12 text-center">Chargement du dashboard...</div>;
  if (error) return <div className="py-12 text-center text-red-600">{error}</div>;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border flex flex-col items-center">
          <ChartBarIcon className="w-10 h-10 text-blue-500 mb-2" />
          <p className="text-gray-600 text-sm">Produits</p>
          <p className="text-3xl font-bold">{stats.nbProduits}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border flex flex-col items-center">
          <TagIcon className="w-10 h-10 text-green-500 mb-2" />
          <p className="text-gray-600 text-sm">Catégories</p>
          <p className="text-3xl font-bold">{stats.nbCategories}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border flex flex-col items-center">
          <CubeIcon className="w-10 h-10 text-yellow-500 mb-2" />
          <p className="text-gray-600 text-sm">Stock total</p>
          <p className="text-3xl font-bold">{stats.stockTotal}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border flex flex-col items-center">
          <CurrencyDollarIcon className="w-10 h-10 text-orange-500 mb-2" />
          <p className="text-gray-600 text-sm">Valeur stock</p>
          <p className="text-2xl font-bold">{stats.valeurStock.toLocaleString()} F</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border mt-8">
        <h3 className="text-lg font-semibold mb-4">Évolution du stock (6 derniers mois)</h3>
        <Line
          data={{
            labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
            datasets: [
              {
                label: 'Stock total',
                data: [120, 110, 130, 125, 140, stats.stockTotal],
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                tension: 0.4,
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              title: { display: false },
            },
            scales: {
              y: { beginAtZero: true },
            },
          }}
          height={80}
        />
      </div>
    </>
  );
} 