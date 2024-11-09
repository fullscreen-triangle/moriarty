import CesiumWrapper from "./CesiumWrapper";

export default function CesiumModel() {
    return (
        <CesiumWrapper 
            modelUrl="/models/sprint.glb" 
            geojsonPath="/maps/double_track.geojson"
        />
    );
}