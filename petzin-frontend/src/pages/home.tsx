export function Home() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Bem-vindo ao Petzin</h1>
        <p className="text-lg text-gray-600 mb-8">
          Gerencie reservas, clientes e disponibilidade do seu canil
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-xl font-semibold text-blue-600 mb-2">Clientes</h3>
            <p className="text-gray-600">Gerencie informações dos proprietários</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-xl font-semibold text-blue-600 mb-2">Reservas</h3>
            <p className="text-gray-600">Crie e acompanhe as reservas</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-xl font-semibold text-blue-600 mb-2">Disponibilidade</h3>
            <p className="text-gray-600">Confira a disponibilidade do canil</p>
          </div>
        </div>
      </div>
    </div>
  );
}
