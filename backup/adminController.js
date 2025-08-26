const Artist = require("../backend/models/Artist");
const User = require("../backend/models/User");


exports.getAllArtistsforModeration = (req, res) => {
    Artist.findAll((err, artists) => {
        if (err) return res.status(500).json({ message: "Error al buscar los artistas" });
        res.status(200).json(artists);
    });
};

exports.banArtistById = (res, req) => {
    const { id } = req.params;

    User.delete(id, (err, result) => {
        if (err) return res.status(500).json({ message: "Error al eliminar el artista" });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Artista no encontrado para eliminar" });
        res.status(200).json({ message: "Artista eliminado con éxito" });
    });
}