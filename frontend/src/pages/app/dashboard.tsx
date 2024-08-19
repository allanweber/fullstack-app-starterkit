export function Dashboard() {
  // const { messages } = Route.useLoaderData();
  return (
    <div>
      <h3>Dashboard</h3>
      <p>Protected route</p>
      {/* <Suspense fallback={<div>Loading...</div>}>
        <Await promise={messages}>
          {(data) => {
            return <div>{data}</div>;
          }}
        </Await>
      </Suspense> */}
    </div>
  );
}
