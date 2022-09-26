export default function HistoryByID({ id }) {
  return (
    <>
      <div>received id: '{id}'</div>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const { id } = ctx.query;

  return {
    props: {
      id,
    },
  };
}
