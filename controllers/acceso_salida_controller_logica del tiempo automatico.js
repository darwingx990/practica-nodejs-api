// importar el modulo acceso_salida
const acceso_salida = require("../models/acceso_salida");
// importar modelos relacionados
const celda = require("../models/celda");
const historial_parqueo = require("../models/historial_parqueo");

// Validar el metodo create/crear acceso_salida
const create = async (req, res) => {
  try {
    const { movimiento, fecha_hora, puerta, id_vehiculo } = req.body;

    if (!movimiento || !fecha_hora || !puerta || !id_vehiculo) {
      return res.status(400).json({
        succes: false,
        message: "Movimiento, fecha_hora, puerta e id_vehiculo son requeridos",
      });
    }

    let tiempo_estadia = "0"; // default for entrada
    let assignedCelda = null;

    if (movimiento === "entrada") {
      // Find available cell
      const availableCelda = await celda.findOne({ estado: "libre" });
      if (!availableCelda) {
        return res.status(400).json({
          succes: false,
          message: "No hay celdas disponibles",
        });
      }

      // Update cell to occupied
      await celda.update(availableCelda.id_celda, { estado: "ocupada" });

      // Create historial_parqueo
      await historial_parqueo.create({
        id_celda: availableCelda.id_celda,
        id_vehiculo,
        fecha_hora,
      });

      assignedCelda = availableCelda.id_celda;
      tiempo_estadia = "0";

    } else if (movimiento === "salida") {
      // Find the latest historial_parqueo for the vehicule
      const historial = await historial_parqueo.findOne({ id_vehiculo }).sort({ fecha_hora: -1 });
      if (!historial) {
        return res.status(400).json({
          succes: false,
          message: "No se encontró registro de entrada para este vehículo",
        });
      }

      // Calculate stay time
      const entryTime = new Date(historial.fecha_hora);
      const exitTime = new Date(fecha_hora);
      const diffMs = exitTime - entryTime;
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      tiempo_estadia = `${diffHours}h ${diffMinutes}m`;

      // Update cell to free
      await celda.update(historial.id_celda, { estado: "libre" });

      // Delete historial_parqueo
      await historial_parqueo.delete(historial.id_historial_parqueo);

      assignedCelda = historial.id_celda;

    } else {
      return res.status(400).json({
        succes: false,
        message: "Movimiento debe ser 'entrada' o 'salida'",
      });
    }

    const modelo_acceso_salida = await acceso_salida.create({
      movimiento,
      fecha_hora,
      puerta,
      tiempo_estadia,
      id_vehiculo,
      id_celda: assignedCelda,
    }); // Esto Graba en la base de datos

    res.status(201).json({
      succes: true,
      message: "Acceso salida registrado exitosamente",
      data: modelo_acceso_salida,
    });
  } catch (error) {
    console.error("Error al crear acceso_salida: ", error);
    res.status(500).json({
      succes: false,
      message: "Error interno del servidor",
      data: error.message,
    });
  }
};

// Obtener todos los acceso_salida
const findAll = async (req, res) => {
  try {
    const accesos_salida = await acceso_salida.findAll();
    res.status(200).json({
      succes: true,
      message: "Accesos salida obtenidos exitosamente",
      data: accesos_salida,
    });
  } catch (error) {
    console.error("Error al obtener acceso_salida: ", error);
    res.status(500).json({
      succes: false,
      message: "Error interno del servidor",
      data: error.message,
    });
  }
};

// Obtener acceso_salida por ID
const findById = async (req, res) => {
  try {
    const { id_acceso_salida } = req.params;
    if (!id_acceso_salida) {
      return res.status(400).json({
        succes: false,
        message: "El id del acceso salida es requerido",
      });
    }

    const accesoSalida = await acceso_salida.findById(id_acceso_salida);

    if (!accesoSalida) {
      return res.status(404).json({
        succes: false,
        message: "Acceso salida no encontrado",
      });
    }

    res.status(200).json({
      succes: true,
      message: "Acceso salida obtenido exitosamente",
      data: accesoSalida,
    });
  } catch (error) {
    console.error("Error al obtener acceso salida: ", error);
    res.status(500).json({
      succes: false,
      message: "Error interno del servidor",
      data: error.message,
    });
  }
};

// Obtener acceso_salida por movimiento
const searchByMovimiento = async (req, res) => {
  try {
    const { term } = req.params;

    if (!term) {
      return res.status(400).json({
        success: false,
        message: "El termino de busqueda es requerido",
      });
    }

    const accesos_salida = await acceso_salida.searchByMovimiento(term);

    res.status(200).json({
      success: true,
      message: `Busqueda de accesos salida por: "${term}"`,
      data: accesos_salida,
    });
  } catch (error) {
    console.error("Error al buscar accesos salida: ", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// Actualizar acceso_salida
const update = async (req, res) => {
  try {
    const { id_acceso_salida } = req.params;
    const { movimiento, fecha_hora, puerta, tiempo_estadia, id_vehiculo } =
      req.body;

    if (!id_acceso_salida) {
      return res.status(404).json({
        success: false,
        message: "El id del acceso salida no existe",
      });
    }

    // Verificar que el acceso_salida exista
    const accesoSalida = await acceso_salida.findById(id_acceso_salida);
    if (!accesoSalida) {
      return res.status(404).json({
        success: false,
        message: "Acceso salida no encontrado",
      });
    }

    // Invocar el metodo Update del modelo
    const accesoSalidaUpdated = await acceso_salida.update(id_acceso_salida, {
      movimiento,
      fecha_hora,
      puerta,
      tiempo_estadia,
      id_vehiculo,
    });

    res.status(200).json({
      success: true,
      message: "Acceso salida actualizado exitosamente",
      data: accesoSalidaUpdated,
    });
  } catch (error) {
    console.error("Error al actualizar acceso salida:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// Eliminar un acceso_salida
const deleteAccesoSalida = async (req, res) => {
  try {
    const { id_acceso_salida } = req.params;

    if (!id_acceso_salida) {
      return res.status(404).json({
        success: false,
        message: "El acceso salida no existe",
      });
    }

    // Verificar que el acceso_salida exista
    const accesoSalida = await acceso_salida.findById(id_acceso_salida);
    if (!accesoSalida) {
      return res.status(404).json({
        success: false,
        message: "Acceso salida no encontrado",
      });
    }

    await acceso_salida.delete(id_acceso_salida);

    res.status(200).json({
      success: true,
      message: "Acceso salida eliminado exitosamente",
    });
  } catch (error) {
    console.error("Error al eliminar un acceso salida:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// Exportar los controladores
module.exports = {
  create,
  findAll,
  findById,
  searchByMovimiento,
  update,
  deleteAccesoSalida,
};
