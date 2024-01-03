// import React, { useState, useEffect } from 'react';
// // import CarouselDirectMints from "components/carousel/CarouselDirectMints";
// // import CarouselLazyMints from "components/carousel/CarouselLazyMints";
// // import CarouselAuctionMints from "components/carousel/CarouselAuctionMints";
// import {
//   CarouselDirectMints,
//   CarouselLazyMints,
//   CarouselAuctionMints,
// } from '../components';

// import DirectNfts from './DirectNfts';
// import LazyNfts from './LazyNfts';
// import AuctionNfts from './AuctionNfts';
// import { selectUserId } from '../../auth/authSlice';
// import { Briefcase, Collection, Cube } from '../../../res/assets/mints';
// import { useSelector, useDispatch } from 'react-redux';
// import {
//   fetchAllMarketListedDirectNFTs,
//   fetchAllLazyMarketListedNFTs,
//   fetchAllMarketListedAuctionNFTs,
//   getCategories,
// } from '../../../app/services/apiSlice';

// ///====================={New}============================================

// import {
//   Set_Nft_Categories,
//   getNftCategories,
// } from '../../category/categorySlice';
// import { GoSpinner } from '../../components/GoSpinner';

// //============{Network}==================================================
// import {
//   useNetworkRPC,
//   useChainId,
//   useNetworkMode,
// } from '../../chains/networkSlice';
// import { useWalletAddress } from '../../chains/userTokensSlice';

// const mintOptions = ['Moscow', 'Saint Petersburg', 'Dubai'];

// // const chains = [
// // 	{
// // 		id: 1,
// // 		name: "Ethereum",
// // 	},
// // 	{
// // 		id: 56,
// // 		name: "Binance Smart Chain",
// // 	},
// // 	{
// // 		id: 137,
// // 		name: "Polygon",
// // 	},
// // 	{
// // 		id: 10,
// // 		name: "Optimism",
// // 	},
// // 	{
// // 		id: 42161,
// // 		name: "Arbitrum",
// // 	},
// // 	{
// // 		id: 43114,
// // 		name: "Avalanche",
// // 	},
// // ];

// //import livemode

// //======={FROM DB BLOCKCHAINDATA}======================
// const Marketplace = (userId) => {
//   const dispatch = useDispatch();

//   const CATEGORIES = useSelector(getNftCategories); // new
//   const [filteredData, setFilteredData] = useState([]);

//   const defaultFilter = { name:'', category: '', price: '' };
//   const [filters, setFilters] = useState(defaultFilter);
//   const [isSuccessDirect, setIsSuccessDirect] = useState(false);
//   const [isSuccessLazy, setIsSuccessLazy] = useState(false);
//   const [isSuccessAuction, setIsSuccessAuction] = useState(false);

//   //========================={USESELECTOR}=======================================

//   const [selectedMintOption, setSelectedMintOption] = useState(mintOptions[0]);

//   const walletAddress = useSelector(useWalletAddress);

//   const networkRpc = useSelector(useNetworkRPC);
//   const liveMode = useSelector(useNetworkMode);
//   const chainId = useSelector(useChainId);

//   const [diretNFTs, setDiretNFTs] = useState(null);
//   const [lazyNFTs, setLazyNFTs] = useState(null);
//   const [auctionNFTs, setAuctionNFTs] = useState(null);
//   const goSvgClass = 'mt-6 mb-6 ml-20 w-[32px] h-[32px] animate-ping';

//   useEffect(() => {
//     getDirectMints();
//     getLazyMints();
//     getAuctionMints();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [diretNFTs, lazyNFTs, auctionNFTs]);


//   // Moscow
//   async function getDirectMints() {
//     let data = {
//       userId,
//       chainId,
//       networkRpc,
//       liveMode,
//     };
//     await fetchAllMarketListedDirectNFTs(data)
//       .the((response) => {
//         setDiretNFTs(response);
//         setIsSuccessDirect(true);
//       })
//       .catch((error) => {
//         console.log(error);
//       });

//     // updateDirectDataFetched(true);
//   }
//   // Saint Petersburg
//   async function getLazyMints() {
//     let data = {
//       userId,
//       chainId,
//       networkRpc,
//       liveMode,
//     };
//     await fetchAllLazyMarketListedNFTs(data)
//       // updateLazyDataFetched(true);
//       .the((response) => {
//         setLazyNFTs(response);
//         setIsSuccessLazy(true);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }

//   // Dubai
//   async function getAuctionMints() {
//     let data = {
//       userId,
//       chainId,
//       networkRpc,
//       liveMode,
//     };
//     await fetchAllMarketListedAuctionNFTs(data)
//       .the((response) => {
//         setAuctionNFTs(response);
//         setIsSuccessAuction(true);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//     // updateAuctionDataFetched(true);
//   }

//   //============================{New}======================================================

//   async function getAllCategories() {
//     let res = await getCategories();
//     if (res >= 1) {
//       dispatch(Set_Nft_Categories(res));
//       console.info('categories', res);
//     }
//   }

//   const handleInputChange = (e) => {
//     setFilters({
//       ...filters,
//       [e.target.name]: e.target.value,
//     });
//   };

//   function activeFilteredData() {
//     if (selectedMintOption === mintOptions[0]) {
//       if (isSuccessDirect) {
//         let fdata = diretNFTs?.filter((item) => {
//           return (
//             item?.name
//               ?.toLowerCase()
//               .includes(filters.name.toLowerCase()) &&
//             (filters?.category === '' ||
//               item?.category === filters.category) &&
//             (filters?.price === '' ||
//               Number(item?.itemPrice) <= Number(filters.price))
//           );
//         });
//         setFilteredData(fdata);
//       }
//     }
//     if (selectedMintOption === mintOptions[1]) {
//       if (isSuccessLazy) {
//         let fdata = lazyNFTs?.filter((item) => {
//           return (
//             item?.name
//               ?.toLowerCase()
//               .includes(filters.name.toLowerCase()) &&
//             (filters?.category === '' ||
//               item?.category === filters.category) &&
//             (filters?.price === '' ||
//               Number(item?.itemPrice) <= Number(filters.price))
//           );
//         });
//         setFilteredData(fdata);
//       }
//     }
//     if (selectedMintOption === mintOptions[2]) {
//       if (isSuccessAuction) {
//         let fdata = auctionNFTs?.filter((item) => {
//           return (
//             item?.name
//               ?.toLowerCase()
//               .includes(filters.name.toLowerCase()) &&
//             (filters?.category === '' ||
//               item?.category === filters.category) &&
//             (filters?.price === '' ||
//               Number(item?.itemPrice) <= Number(filters.price))
//           );
//         });
//         setFilteredData(fdata);
//       }
//     }
//   }

//   //========================{New}=======================================================
//   useEffect(() => {
//     activeFilteredData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [filters, selectedMintOption, diretNFTs, lazyNFTs, auctionNFTs]);

//   useEffect(() => {
//     getAllCategories();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   return (
//     <>
//       {/* <NftHeader /> */}

//       <div className="flex">
//         <div className="mx-auto">
//           <section className="mb-3 py-4 w-screen flex flex-row bg-gray-100 dark:bg-black/30">
//             <div className="mx-auto flex flex-row gap-14">
//               <div
//                 className={`flex flex-col gap-2 items-center cursor-pointer`}
//                 onClick={() => setSelectedMintOption(mintOptions[0])}
//               >
//                 {/* // replace with images */}
//                 <div className="w-[32px] h-[32px]">
//                   <Collection
//                     className={`icon-hoverable ${
//                       selectedMintOption === mintOptions[0] && 'stroke-rose-600'
//                     }`}
//                   />
//                 </div>
//                 <span
//                   className={`text-sm ${
//                     selectedMintOption === mintOptions[0]
//                       ? 'text-rose-600'
//                       : 'typography'
//                   }`}
//                 >
//                  Moscow
//                 </span>
//               </div>
//               <div
//                 className={`flex flex-col gap-2 items-center cursor-pointer`}
//                 onClick={() => setSelectedMintOption(mintOptions[1])}
//               >
//                 <div className={`w-[32px] h-[32px]`}>
//                   <Briefcase
//                     className={`icon-hoverable ${
//                       selectedMintOption === mintOptions[1] && 'stroke-rose-600'
//                     }`}
//                   />
//                 </div>
//                 <span
//                   className={`text-sm ${
//                     selectedMintOption === mintOptions[1]
//                       ? 'text-rose-600'
//                       : 'typography'
//                   }`}
//                 >
//                  Saint Petersburg
//                 </span>
//               </div>
//               <div
//                 className={`flex flex-col gap-2 items-center cursor-pointer`}
//                 onClick={() => setSelectedMintOption(mintOptions[2])}
//               >
//                 <div className={`w-[32px] h-[32px]`}>
//                   <Cube
//                     className={`icon-hoverable ${
//                       selectedMintOption === mintOptions[2] && 'stroke-rose-600'
//                     }`}
//                   />
//                 </div>
//                 <span
//                   className={`text-sm ${
//                     selectedMintOption === mintOptions[2]
//                       ? 'text-rose-600'
//                       : 'typography'
//                   }`}
//                 >
//                   Dubai
//                 </span>
//               </div>
//             </div>
//           </section>   

//           {/* ======================{Filter Section}============================== */}
//           <div className="mt-5 w-1 h-1"></div>
//           <section className="px-3 py-4 border rounded-lg flex flex-col lg:flex-row flex-wrap gap-2 lg:gap-4 lg:justify-center lg:items-center">
//             <div className="relative z-0 group bg-gray-100 dark:bg-transparent rounded-lg">
//               <input
//                 type="text"
//                 name="name"
//                 id="name"
//                 className="block w-full py-[6px] pl-12 text-sm text-gray-900 bg-transparent border border-gray-300 rounded-lg appearance-none dark:text-white dark:border-gray-600 dark:focus:border-rose-500 focus:outline-none focus:ring-0 focus:border-rose-600 peer"
//                 placeholder=""
//                 onChange={handleInputChange}
//                 value={filters.name}
//               />
//               <label
//                 htmlFor="name"
//                 className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 translate-x-3 scale-75 top-2 left-2 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-rose-600 peer-focus:dark:text-rose-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
//               >
//                 Filter by name
//               </label>
//             </div>

//             <div className="relative z-0 group bg-gray-100 dark:bg-transparent rounded-lg">
//               <input
//                 type="text"
//                 name="price"
//                 id="price"
//                 className="block w-full py-[6px] pl-12 text-sm text-gray-900 bg-transparent border border-gray-300 rounded-lg appearance-none dark:text-white dark:border-gray-600 dark:focus:border-rose-500 focus:outline-none focus:ring-0 focus:border-rose-600 peer"
//                 placeholder=""
//                 onChange={handleInputChange}
//                 value={filters.price}
//               />
//               <label
//                 htmlFor="price"
//                 className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 translate-x-3 scale-75 top-2 left-2 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-rose-600 peer-focus:dark:text-rose-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
//               >
//                 Max. price
//               </label>
//             </div>

//             <div className="flex flex-row gap-2 items-center">
//               <label
//                 htmlFor="category"
//                 className="text-sm text-gray-500 dark:text-gray-400"
//               >
//                 Category:
//               </label>
//               <select
//                 name="category"
//                 className="dropdown"
//                 value={filters.category}
//                 onChange={handleInputChange}
//               >
//                 <option value="">All</option>
//                 {CATEGORIES.map((category) => (
//                   <option key={category?._id} value={category?._id}>
//                     {category?.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <button
//                 className="px-2 py-1 rounded-md btn btn-secondary"
//                 onClick={() => setFilters(defaultFilter)}
//               >
//                 Clear All
//               </button>
//             </div>
//           </section>

//           {selectedMintOption === 'Direct' && (
//             <div className="w-screen">
//               <section className="px-8">
//                 <span className="mt-10 mb-2 dark:mb-0 section-heading typography flex flex-row items-end">
//                   <span>Direct NFTs</span>
//                   <div className="fill-neutral-600 dark:fill-neutral-100">
//                     <svg
//                       className="icon-heading"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M9 5l7 7-7 7"
//                       ></path>
//                     </svg>
//                   </div>
//                 </span>
//                 <div className="p-6 dark:p-0 bg-gray-50 dark:bg-transparent border rounded-lg dark:rounded-none border-neutral-200 dark:border-none">
//                   {isSuccessDirect ? (
//                     <DirectNfts list={filteredData} />
//                   ) : (
//                     <GoSpinner className={goSvgClass} />
//                   )}
//                 </div>
//               </section>

//               <section className="">
//                 <span className="mt-10 px-8 section-heading typography flex flex-row items-end">
//                   <span>Lazy Mints</span>
//                   <div className="fill-neutral-600 dark:fill-neutral-100">
//                     <svg
//                       className="icon-heading"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M9 5l7 7-7 7"
//                       ></path>
//                     </svg>
//                   </div>
//                 </span>
//                 {/* <div className="bg-gray-50 dark:bg-transparent border rounded-lg dark:rounded-none border-neutral-200 dark:border-none"> */}
//                 <section className="w-full overflow-clip">
//                   <div className="mx-10 dark:mb-0 bg-gray-50 dark:bg-transparent flex flex-col">
//                     {isSuccessLazy ? (
//                       <CarouselLazyMints title="Framer" list={diretNFTs} />
//                     ) : (
//                       <GoSpinner className={goSvgClass} />
//                     )}
//                   </div>
//                 </section>
//                 {/* </div> */}
//               </section>

//               <section className="">
//                 <span className="mt-10 px-8 section-heading typography flex flex-row items-end">
//                   <span>Auction Mints</span>
//                   <div className="fill-neutral-600 dark:fill-neutral-100">
//                     <svg
//                       className="icon-heading"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M9 5l7 7-7 7"
//                       ></path>
//                     </svg>
//                   </div>
//                 </span>
//                 {/* <div className="bg-gray-50 dark:bg-transparent border rounded-lg dark:rounded-none border-neutral-200 dark:border-none"> */}
//                 <section className="w-full overflow-clip">
//                   <div className="mx-10 dark:mb-0 bg-gray-50 dark:bg-transparent flex flex-col">
//                     {isSuccessAuction ? (
//                       <CarouselAuctionMints title="Framer" list={auctionNFTs} />
//                     ) : (
//                       <GoSpinner className={goSvgClass} />
//                     )}
//                   </div>
//                 </section>
//                 {/* </div> */}
//               </section>
//             </div>
//           )}
//           {selectedMintOption === 'Lazy' && (
//             <div className="w-screen">
//               <section className="px-8">
//                 <span className="mt-10 mb-2 dark:mb-0 section-heading typography flex flex-row items-end">
//                   <span>Lazy NFTs</span>
//                   <div className="fill-neutral-600 dark:fill-neutral-100">
//                     <svg
//                       className="icon-heading"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M9 5l7 7-7 7"
//                       ></path>
//                     </svg>
//                   </div>
//                 </span>
//                 <div className="p-6 dark:p-0 bg-gray-50 dark:bg-transparent border rounded-lg dark:rounded-none border-neutral-200 dark:border-none">
//                   {isSuccessLazy ? (
//                     <LazyNfts list={filteredData} />
//                   ) : (
//                     <GoSpinner className={goSvgClass} />
//                   )}
//                 </div>
//               </section>

//               <section className="">
//                 <span className="mt-10 px-8 section-heading typography flex flex-row items-end">
//                   <span>Direct Mints</span>
//                   <div className="fill-neutral-600 dark:fill-neutral-100">
//                     <svg
//                       className="icon-heading"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M9 5l7 7-7 7"
//                       ></path>
//                     </svg>
//                   </div>
//                 </span>
//                 {/* <div className="bg-gray-50 dark:bg-transparent border rounded-lg dark:rounded-none border-neutral-200 dark:border-none"> */}
//                 <section className="w-full overflow-clip">
//                   <div className="mx-10 dark:mb-0 bg-gray-50 dark:bg-transparent flex flex-col">
//                     {isSuccessDirect ? (
//                       <CarouselDirectMints title="Framer" list={diretNFTs} />
//                     ) : (
//                       <GoSpinner className={goSvgClass} />
//                     )}
//                   </div>
//                 </section>
//                 {/* </div> */}
//               </section>

//               <section className="">
//                 <span className="mt-10 px-8 section-heading typography flex flex-row items-end">
//                   <span>Auction Mints</span>
//                   <div className="fill-neutral-600 dark:fill-neutral-100">
//                     <svg
//                       className="icon-heading"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M9 5l7 7-7 7"
//                       ></path>
//                     </svg>
//                   </div>
//                 </span>
//                 {/* <div className="bg-gray-50 dark:bg-transparent border rounded-lg dark:rounded-none border-neutral-200 dark:border-none"> */}
//                 <section className="w-full overflow-clip">
//                   <div className="mx-10 dark:mb-0 bg-gray-50 dark:bg-transparent flex flex-col">
//                     {isSuccessAuction ? (
//                       <CarouselAuctionMints title="Framer" list={auctionNFTs} />
//                     ) : (
//                       <GoSpinner className={goSvgClass} />
//                     )}
//                   </div>
//                 </section>
//                 {/* </div> */}
//               </section>
//             </div>
//           )}
//           {selectedMintOption === 'Auction' && (
//             <div className="w-screen">
//               <section className="px-8">
//                 <span className="mt-10 mb-2 dark:mb-0 section-heading typography flex flex-row items-end">
//                   <span>Auction NFTs</span>
//                   <div className="fill-neutral-600 dark:fill-neutral-100">
//                     <svg
//                       className="icon-heading"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M9 5l7 7-7 7"
//                       ></path>
//                     </svg>
//                   </div>
//                 </span>
//                 <div className="p-6 dark:p-0 bg-gray-50 dark:bg-transparent border rounded-lg dark:rounded-none border-neutral-200 dark:border-none">
//                   {isSuccessAuction ? (
//                     <AuctionNfts list={filteredData} />
//                   ) : (
//                     <GoSpinner className={goSvgClass} />
//                   )}
//                 </div>
//               </section>

//               <section className="w-screen">
//                 <span className="mt-10 px-8 section-heading typography flex flex-row items-end">
//                   <span>Lazy Mints</span>
//                   <div className="fill-neutral-600 dark:fill-neutral-100">
//                     <svg
//                       className="icon-heading"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M9 5l7 7-7 7"
//                       ></path>
//                     </svg>
//                   </div>
//                 </span>
//                 {/* <div className="bg-gray-50 dark:bg-transparent border rounded-lg dark:rounded-none border-neutral-200 dark:border-none"> */}
//                 <section className="w-full overflow-clip">
//                   <div className="mx-6 md:mx-12 dark:mb-0 bg-gray-50 dark:bg-transparent flex flex-col">
//                     {isSuccessLazy ? (
//                       <CarouselLazyMints title="Framer" list={lazyNFTs} />
//                     ) : (
//                       <GoSpinner className={goSvgClass} />
//                     )}
//                   </div>
//                 </section>
//                 {/* </div> */}
//               </section>

//               <section className="">
//                 <span className="mt-10 px-8 section-heading typography flex flex-row items-end">
//                   <span>Direct Mints</span>
//                   <div className="fill-neutral-600 dark:fill-neutral-100">
//                     <svg
//                       className="icon-heading"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M9 5l7 7-7 7"
//                       ></path>
//                     </svg>
//                   </div>
//                 </span>
//                 {/* <div className="bg-gray-50 dark:bg-transparent border rounded-lg dark:rounded-none border-neutral-200 dark:border-none"> */}
//                 <section className="w-full overflow-clip">
//                   <div className="mx-6 md:mx-12 dark:mb-0 bg-gray-50 dark:bg-transparent flex flex-col">
//                     {isSuccessDirect ? (
//                       <CarouselDirectMints title="Framer" list={diretNFTs} />
//                     ) : (
//                       <GoSpinner className={goSvgClass} />
//                     )}
//                   </div>
//                 </section>
//                 {/* </div> */}
//               </section>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default Marketplace;
