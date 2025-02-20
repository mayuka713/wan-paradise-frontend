import StoreList  from "../../common/StoreList";

const DogRunStoreList = () => (
  <StoreList storeType={1} title="ドッグラン" tagType={[1, 2]} noDataMessage="ドッグラン情報がありません" />
  
);

export default DogRunStoreList;