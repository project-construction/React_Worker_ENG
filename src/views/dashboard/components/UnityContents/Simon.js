import React, {useEffect, useState} from 'react';
import Unity, {UnityContext} from "react-unity-webgl";

function Puzzle() {
    const unityContext = new UnityContext({
        loaderUrl: "build/Simon.loader.js",
        dataUrl: "build/Simon.data.unityweb",
        frameworkUrl: "build/Simon.framework.js.unityweb",
        codeUrl: "build/Simon.wasm.unityweb",
    });

    const [passedRoundNum, setPassedRoundNum] = useState(null);
    const handleReceive = async (passedRoundNum) => {
        try {
            const jwtToken = localStorage.getItem('accessToken');
            const response = await fetch('http://localhost:8080/unityContent/insertContent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
                body: JSON.stringify({ name:"simon",score: passedRoundNum ,collect:0,wrong:0}),
                mode: 'cors'
            });
        } catch (error) {
            console.error('오류 발생:', error);
        }
    };
    useEffect(function (){
        unityContext.on("SendPassedRoundNum",function (passedRoundNum){
            setPassedRoundNum(passedRoundNum);
            localStorage.setItem("simon",passedRoundNum);
            handleReceive(passedRoundNum);
        });
    },[passedRoundNum]);
    const handleFullscreen = () => {
        if (unityContext) {
            unityContext.setFullscreen(true);
        }
    };
    return (
        <div className="webgl-content">
            <table>
                <header className="unityContainer">
                    <Unity
                        style={{
                            width: '100%',
                            height: '100%',
                        }}
                        unityContext={unityContext}
                    />
                </header>
                <button className="fullscreen-button" onClick={handleFullscreen}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        fill="currentColor"
                        className="bi bi-arrows-fullscreen"
                        viewBox="0 0 16 16"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v3.975a.5.5 0 0 0 .5.5H4.5a.5.5 0 0 0 0-1H1.732l4.096-4.096a.5.5 0 0 0 0-.707zm4.344 0a.5.5 0 0 1 .707 0l4.096 4.096V11.5a.5.5 0 1 1 1 0v3.975a.5.5 0 0 1-.5.5H11.5a.5.5 0 0 1 0-1h2.768l-4.096-4.096a.5.5 0 0 1 0-.707zm0-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0V.525a.5.5 0 0 0-.5-.5H11.5a.5.5 0 0 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 0 .707zm-4.344 0a.5.5 0 0 1-.707 0L1.025 1.732V4.5a.5.5 0 0 1-1 0V.525a.5.5 0 0 1 .5-.5H4.5a.5.5 0 0 1 0 1H1.732l4.096 4.096a.5.5 0 0 1 0 .707z"
                        />
                    </svg>
                </button>
            </table>
        </div>

    );
}

export default Puzzle;
