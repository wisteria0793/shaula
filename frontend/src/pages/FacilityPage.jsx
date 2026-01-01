import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import '../styles/FacilityPage.css'; // 作成したCSSをインポート

function FacilityPage() {

    // APIから取得した施設データを保存
    const [facilities, setFacilities] = useState([]);
    // データの読み込み状態を管理するためのState
    const [loading, setLoading] = useState(true);

    // エラーが発生した際の情報を保存するためのState
    const [error, setError] = useState(null);

    // useEffectフック: コンポーネントが最初に描画された後に一度だけ実行される
    useEffect(() => {
        // APIからデータを取得するための自動機関数を定義
        const fetchFacilities = async () => {
            try{
                // Django APIのエンドポイントにGETリクエストを送信
                // const response = await fetch('http://localhost:8000/api/facilities/');
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/facilities/`);

                // レスポンスが成功でなければエラーを表示
                if (!response.ok){
                    throw new Error('データの取得に失敗しました');
                }

                // レスポンスボディをJSONとして解析
                const data = await response.json();
                // 取得したデータでfacilities Stateを更新
                setFacilities(data);
            } catch(err) {
                console.error('API Error:', err)
                // エラーが発生した場合、error stateを更新
                setError(err.message);
            } finally {
                // 成功・失敗に関わらず、ローディング状態を解除
                setLoading(false);
            }
        };

        // 上で定義した非同期関数を実行
        fetchFacilities();
    // 第二引数の空の配列[]は、useEffectがマウント時に一度だけ実行されることを示す
    }, []); 

    // ローディング中の表示
    if (loading){
        return <div>ローディング中...</div>
    }

    // エラー発生時の表示
    if (error) {
        return <div>エラー: {error}</div>
    }

    return (
    
        <div className="facility-content">
            {/* <h1>Hello World!</h1> */}
            <h1>施設一覧</h1>

            <div className="actions-container">
                <Link to="/facilities/new" className="button">新規施設を追加</Link>
            </div>

            <ul className="facility-list"> {/* classNameを追加 */}
                {facilities.map(facility => (
                    <li key={facility.id} className="facility-list-item"> {/* classNameを追加 */}
                        <Link to={`/facilities/${facility.id}`}>{facility.facility_name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
export default FacilityPage;