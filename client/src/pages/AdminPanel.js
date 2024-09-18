const AdminPanel = () => (
    <div className="p-8">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <form className="mt-4">
            <input type="text" placeholder="Problem Name" className="border p-2 w-full" />
            <input type="text" placeholder="Platform" className="border p-2 w-full mt-4" />
            <button className="mt-4 bg-green-500 text-white px-4 py-2">Add Problem</button>
        </form>
    </div>
);
export default AdminPanel;