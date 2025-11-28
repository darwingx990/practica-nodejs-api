import parkingHistory from '../models/parkingHistory.js';

// Crear un nuevo registro de historial de parqueo
const create = async (req, res) => {
  try {
    // Extraer los campos del cuerpo de la solicitud
    const { placa, check_in, check_out, licensePlate, cost, observaciones, descripcion } = req.body;
    const finalObservaciones = observaciones || descripcion;

    // Validar que los campos obligatorios estén presentes
    if (!placa || !check_in || !check_out || !licensePlate || cost === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Los campos placa, check_in, check_out, licensePlate y cost son obligatorios'
      });
    }

    // Crear el registro en la base de datos
    const newParkingHistory = new parkingHistory({ placa, check_in, check_out, licensePlate, cost, observaciones: finalObservaciones });
    const ParkingHistory = await newParkingHistory.save();

    // Responder con éxito
    res.status(201).json({
      success: true,
      message: 'Registro creado exitosamente',
      data: ParkingHistory
    });
  } catch (error) {
    // Manejar errores
    res.status(500).json({
      success: false,
      message: 'Error al crear el registro',
      error: error.message

    });
  }
};
// Obtener todos los registros de historial de parqueo
const findAll = async (req,res) => {
  try {
    // Obtener todos los registros
    const parkingHistories = await parkingHistory.find().sort({ createdAt: -1 });

    // Responder con la lista de registros
    res.status(200).json({
      success: true,
      message: 'Historial de parqueos obtenidos exitosamente',
      data: parkingHistories
    });
  } catch (error) {
    // Log del error y respuesta de error
    console.error('Error al obtener el historial de parqueos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el historial de parqueos',
      error: error.message
    });
  }
}

// Obtener un registro de historial de parqueo por ID
const findById = async (req, res) => {
  try {
    // Extraer el ID de los parámetros de la ruta
    const { id } = req.params;

    // Validar que el ID esté presente
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'El ID del historial de parqueo es obligatorio'
      });
    }

    // Buscar el registro por ID
    const parkingHistoryRecord = await parkingHistory.findOne({ idint: parseInt(id) });

    // Verificar si el registro existe
    if (!parkingHistoryRecord) {
      return res.status(404).json({
        success: false,
        message: 'Historial de parqueo no encontrado'
      });
    }

    // Responder con el registro encontrado
    res.status(200).json({
      success: true,
      message: 'Historial de parqueo obtenido exitosamente',
      data: parkingHistoryRecord
    });
  } catch (error) {
    // Log del error y respuesta de error
    console.error('Error al obtener el historial de parqueo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el historial de parqueo',
      error: error.message
    });
  }
}
  
// Buscar registros de historial de parqueo por término en observaciones
const searchByDescription = async (req, res) => {
  try {
    // Extraer el término de búsqueda de los query parameters
    const { term } = req.query;

    // Validar que el término esté presente
    if (!term) {
      return res.status(400).json({
        success: false,
        message: 'El término de búsqueda es obligatorio'
      });
    }

    // Realizar la búsqueda
    const parkingHistoryRecords = await parkingHistory.find({
      $or: [
        { observaciones: { $regex: term, $options: 'i' } },
        { placa: { $regex: term, $options: 'i' } },
        { licensePlate: { $regex: term, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });

    // Responder con los resultados
    res.status(200).json({
      success: true,
      message: `Búsqueda de historial de parqueo por: "${term}"`,
      data: parkingHistoryRecords
    });
  } catch (error) {
    // Log del error y respuesta de error
    console.error('Error al buscar el historial de parqueo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al buscar el historial de parqueo',
      error: error.message
    });
  }
};

// Actualizar un registro de historial de parqueo
const update = async (req, res) => {
  try {
    // Extraer el ID de los parámetros y los datos del cuerpo
    const { id } = req.params;
    const { placa, check_in, check_out, licensePlate, cost, observaciones, descripcion } = req.body;
    const finalObservaciones = observaciones !== undefined ? observaciones : descripcion;

    // Validar que el ID esté presente
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'El ID del historial de parqueo es requerido'
      });
    }

    // Verificar que el registro existe
    const existingParkingHistory = await parkingHistory.findOne({ idint: parseInt(id) });
    if (!existingParkingHistory) {
      return res.status(404).json({
        success: false,
        message: 'Historial de parqueo no encontrado'
      });
    }

    // Construir el objeto de actualización solo con campos proporcionados
    const updateData = {};
    if (placa !== undefined) updateData.placa = placa;
    if (check_in !== undefined) updateData.check_in = check_in;
    if (check_out !== undefined) updateData.check_out = check_out;
    if (licensePlate !== undefined) updateData.licensePlate = licensePlate;
    if (cost !== undefined) updateData.cost = cost;
    if (finalObservaciones !== undefined) updateData.observaciones = finalObservaciones;

    // Actualizar el registro
    const updatedParkingHistory = await parkingHistory.findOneAndUpdate(
      { idint: parseInt(id) },
      updateData,
      { new: true, runValidators: true }
    );

    // Responder con el registro actualizado
    res.status(200).json({
      success: true,
      message: 'Historial de parqueo actualizado exitosamente',
      data: updatedParkingHistory
    });
  } catch (error) {
    // Log del error y respuesta de error
    console.error('Error al actualizar el historial de parqueo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el historial de parqueo',
      error: error.message
    });
  }
};

// Eliminar un registro de historial de parqueo
const deleteParkingHistory = async (req, res) => {
  try {
    // Extraer el ID de los parámetros
    const { id } = req.params;

    // Validar que el ID esté presente
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'El ID del historial de parqueo es requerido'
      });
    }

    // Verificar que el registro existe
    const existingParkingHistory = await parkingHistory.findOne({ idint: parseInt(id) });
    if (!existingParkingHistory) {
      return res.status(404).json({
        success: false,
        message: 'Historial de parqueo no encontrado'
      });
    }

    // Eliminar el registro
    await parkingHistory.findOneAndDelete({ idint: parseInt(id) });

    // Responder con éxito
    res.status(200).json({
      success: true,
      message: 'Historial de parqueo eliminado exitosamente'
    });
  } catch (error) {
    // Log del error y respuesta de error
    console.error('Error al eliminar el historial de parqueo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el historial de parqueo',
      error: error.message
    });
  }
};

// Exportar las funciones del controlador
export default {
  create,
  findAll,
  findById,
  searchByDescription,
  update,
  delete: deleteParkingHistory
};
