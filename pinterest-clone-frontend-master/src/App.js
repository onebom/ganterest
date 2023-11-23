import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";
import { useDispatch, useSelector } from "react-redux";
import client from "./api/client";
import { actionCreators as PinCreators } from "./redux/modules/pin.js";
import { actionCreators as userActions } from "./redux/modules/user";
import { history } from "./redux/configureStore.js";
import { Header, Mainboard, LoginHeader, LoginMainboard } from "./components";
import { PinDetail, AddPin, MyPage, Search } from "./pages";

// unsplash 사용하여 axios로 통신 
// {
//     baseUrl: "https://api.unsplash.com/",
//     headers: {
//         Authorization: "Client-ID ox7faZqheWDp_Wj5iYOCpVb6Yh_M51SKkG-3Yr6Azh4",
//     }

function App() {
    const dispatch = useDispatch();
    const isLogin = useSelector((state) => state.user.is_login);
    // 로그인이 되어있으면 true, 안되어있으면 false

    // 화면 렌더링될때 pins update, login check를 한다.
    useEffect(() => {
        getNewPins();
        dispatch(userActions.loginCheckAPI());
    }, []);

    // update 변수 : pins
    const [pins, setNewpins] = React.useState([]);

    // 서버 주소로부터 query에대해 request 후 GET
    const getImages = (term) => {
        return client.get("https://api.unsplash.com/search/photos", {
            params: {
                query: term,
            },
        });
    };

    // header component 렌더링 시 onSearchSubmit 호출
    const onSearchSubmit = (term) => {
        getImages(term).then((res) => {
            let results = res.data.results; // str type pin
            let newPins = [...results, ...pins]; //기존 Pins에 results append
            newPins.sort(function (a, b) {
                return 0.5 - Math.random();
            }); //random으로 배열 섞기
            setNewpins(newPins);
        });
    };

    const getNewPins = () => {
        let promises = [];
        let pinData = [];

        let pins = ["ocean", "Tokyo", "city"];

        pins.forEach((pinTerm) => {
            promises.push(
                getImages(pinTerm).then((res) => {
                    let results = res.data.results;

                    pinData = pinData.concat(results);

                    pinData.sort(function (a, b) {
                        return 0.5 - Math.random();
                    });
                })
            );
        });
        Promise.all(promises).then(() => {
            setNewpins(pinData); // str pin
            dispatch(PinCreators.getZapPin(pinData));
        });
    };

    return (
        <React.Fragment>
            {isLogin ? (
                <ConnectedRouter history={history}>
                    <Header onSubmit={onSearchSubmit} />
                    <Route path="/" exact>
                        <Mainboard />
                    </Route>
                    <Route path="/view/search/:word" exact>
                        <Search />
                    </Route>
                    <Route path="/detail/:id" exact component={PinDetail} />
                    <Route path="/addpin" exact component={AddPin} />
                    <Route path="/mypage" exact component={MyPage} />
                </ConnectedRouter>
            ) : (
                <ConnectedRouter history={history}>
                    <Route path="/" exact>
                        <LoginHeader />
                        <LoginMainboard pins={pins} />
                    </Route>
                </ConnectedRouter>
            )}
        </React.Fragment>
    );
}

export default App;
