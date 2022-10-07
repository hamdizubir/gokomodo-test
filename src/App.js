import './App.css';
import styled from 'styled-components'
import { useEffect, useState } from 'react';
import axios from 'axios';

const ListContainer = styled.div`
  display: flex;
  background-color: white;
  width: 100%;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 12px;
  
  // Prevent overflow because of padding
  padding: 0px 632px;
  padding-top: 24px;
  box-sizing:border-box;
 -moz-box-sizing:border-box;
 -webkit-box-sizing:border-box;
 -ms-box-sizing:border-box;
`

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 220px;
  background-color: skyblue;
  margin: auto;
  margin-bottom: 10px;

  border-radius: 12px;
  padding: 12px;
  cursor: pointer;
`

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width:100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
`


const ModalContent = styled.div`
  position:fixed;
  background: white;
  width: 50%;
  height: 300px;
  top:50%;
  left:50%;
  transform: translate(-50%,-50%);
  display: flex;
  flex-direction: column;
  padding: 24px;
`

const getList = async (page) => {
  try {
    let url;
    url = `https://swapi.dev/api/planets/?page=${page}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
}

const getDetail = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
}

function App() {

  const [planetList, setPlanetList] = useState([]);
  const [planetDetail, setPlanetDetail] = useState();

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [errorDetail, setErrorDetail] = useState(false);
  const [noData, setNoData] = useState(false);
  const [noMoreData, setNoMoreData] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const loadPlanetList = (page) => {
    setError(false)
    setLoading(true);
    setTimeout(() => {
      getList(page)
        .then((res) => {
          if (res.count === 0) return setNoData(true);
          const newList = planetList.concat(res.results);

          setPlanetList(newList);
          const newPage = page + 1;
          setPage(newPage);
          if (res.next === null) setNoMoreData(true);
        })
        .catch((err) => {
          setError(true)
        })
        .finally(() => {
          setLoading(false);
        })

    }
      , 500);
  }

  const loadPlanetDetail = (url) => {
    setLoadingDetail(true);
    setErrorDetail(false)
    setTimeout(() => {
      getDetail(url)
        .then((res) => {
          setPlanetDetail(res)
          setShowDetail(true)
        })
        .catch((err) => {
          setErrorDetail(true)
        })
        .finally(() => {
          setLoadingDetail(false);
        })

    }
      , 500);
  }


  window.onscroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
      if (!noMoreData) {
        loadPlanetList(page);
      }
    }
  }

  useEffect(() => {
    loadPlanetList(page);
  }, []);

  return (
    <div >
      <h1 style={{ textAlign: 'center' }}>Star Wars Planet</h1>
      <hr />
      <h5 style={{ textAlign: 'center' }}>Click the card to see the planet's detail</h5>
      <ListContainer>
        {
          planetList && planetList.map((item, index) => (
            <CardContainer onClick={() => loadPlanetDetail(item.url)} key={index}>
              <h2 style={{ textAlign: 'center', margin: 0, marginBottom: '12px' }}>{item.name}</h2>
              <div style={{ width: '100%', height: '2px', backgroundColor: 'grey', marginBottom: '12px' }} />
              <h4 style={{ margin: 0 }}>population: {item.population}</h4>
              <h4 style={{ margin: 0 }}>climate: {item.climate}</h4>
              <h4 style={{ margin: 0 }}>terrain: {item.terrain}</h4>
            </CardContainer>
          ))
        }
      </ListContainer>
      {loading ? <h3 style={{ textAlign: 'center' }}>Loading..</h3> : ""}
      {noMoreData ? <h3 style={{ textAlign: 'center' }}>You've reached the bottom of the list</h3> : ""}
      {noData ? <h3 style={{ textAlign: 'center' }}>No data found</h3> : ""}
      {error ? <h3 style={{ textAlign: 'center' }}>Error Loading Data</h3> : ""}

      {
        ((errorDetail || loadingDetail) || showDetail) && (
          <ModalContainer>
            <ModalContent>
              {loadingDetail ? <h3 style={{ textAlign: 'center' }}>Loading detail..</h3> : ""}
              {errorDetail ? <h3 style={{ textAlign: 'center' }}>Error loading detail..</h3> : ""}
              {
                showDetail && planetDetail && (
                  <>
                    <h1 style={{ textAlign: 'center' }}>{planetDetail.name}</h1>
                    <div style={{ width: '100%', height: '2px', backgroundColor: 'grey', marginBottom: '12px' }} />
                    <h4 style={{ margin: 0 }}>population: {planetDetail.population}</h4>
                    <h4 style={{ margin: 0 }}>climate: {planetDetail.climate}</h4>
                    <h4 style={{ margin: 0 }}>terrain: {planetDetail.terrain}</h4>
                    <h4 style={{ margin: 0 }}>orbital period: {planetDetail.orbital_period}</h4>
                    <h4 style={{ margin: 0 }}>diameter: {planetDetail.diameter}</h4>
                    <h4 style={{ margin: 0 }}>gravity: {planetDetail.gravity}</h4>
                    <h4 style={{ margin: 0 }}>surface water: {planetDetail.surface_water}</h4>
                    <h4 style={{ margin: 0 }}>resident count: {planetDetail.residents.length}</h4>
                    <button
                      style={{ marginTop: '12px' }}
                      onClick={() => {
                        setShowDetail(false)
                        setPlanetDetail(null)
                      }}>close detail</button>
                  </>
                )
              }
            </ModalContent>
          </ModalContainer>
        )
      }
    </div>
  );
}

export default App;
