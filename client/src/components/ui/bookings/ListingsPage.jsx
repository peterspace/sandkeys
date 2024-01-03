// import Container from "@/app/components/Container";
import Container from '../Container';
import ListingCard from './ListingCard';
import EmptyState from '../EmptyState';
import ClientOnly from '../ClientOnly';

const ListingsPage = async (listings, totalRoomType) => {
  // const { listings, totalRoomType } = props;

  const currentUser = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : null;

  // if (listings.length === 0) {
  //   return (
  //     <ClientOnly>
  //       <EmptyState showReset />
  //     </ClientOnly>
  //   );
  // }

  return (
    <ClientOnly>
      <Container>
        <div
          className="
            pt-24
            grid 
            grid-cols-1 
            sm:grid-cols-2 
            md:grid-cols-3 
            lg:grid-cols-4
            xl:grid-cols-5
            2xl:grid-cols-6
            gap-8
          "
        >
          {listings &&
            listings?.map((listing) => (
              <ListingCard
                currentUser={currentUser}
                key={listing._id}
                data={listing}
                totalRoomType={totalRoomType}
              />
            ))}
        </div>
      </Container>
    </ClientOnly>
  );
};

export default ListingsPage;
