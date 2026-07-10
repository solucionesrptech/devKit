export type SqlTablePreset = {
  id: string;
  label: string;
  description: string;
  table: string;
  defaultKey: string;
  columns: string[];
};

/** Identificador para modo manual sin preset. */
export const CUSTOM_TABLE_PRESET_ID = "custom";

/**
 * Presets iniciales embebidos en código.
 *
 * TODO(fase-settings): Permitir administrar presets desde Settings usando
 * localStorage. Esta lista servirá como seed/fallback al cargar la app cuando
 * no existan presets personalizados guardados localmente.
 */
export const SQL_TABLE_PRESETS: SqlTablePreset[] = [
  {
    id: "contratos",
    label: "Contratos",
    description: "Tabla de documentos y contratos firmados.",
    table: "Contratos",
    defaultKey: "idDocumento",
    columns: [
      "idDocumento",
      "idEstado",
      "idWF",
      "FechaCreacion",
      "FechaUltimaFirma",
      "idTipoFirma",
      "idPlantilla",
      "DocCode",
      "Eliminado",
      "Observacion",
      "idProceso",
      "Enviado",
      "idTipoGeneracion",
      "RutEmpresa",
      "FechaRechazo",
      "FechaModificacion",
      "RutUsuario",
      "RutRechazo",
      "DescargadoEntrega",
      "FechaDescarga",
      "idEstadoReversa",
      "FechaReversa",
      "RutReversa",
      "idEstadogestion",
      "observaciongestion",
      "usuariogestion",
      "s3",
      "sizes3",
    ],
  },
  {
    id: "personas",
    label: "Personas",
    description: "Datos personales de individuos en el sistema.",
    table: "Personas",
    defaultKey: "personaid",
    columns: [
      "personaid",
      "nacionalidad",
      "direccion",
      "ciudad",
      "comuna",
      "fechanacimiento",
      "estadocivil",
      "Eliminado",
      "sexo",
      "afp",
      "isapre",
      "clasemedida",
      "nombre",
      "appaterno",
      "apmaterno",
      "fono",
      "telefono",
      "correo",
      "correoinstitucional",
    ],
  },
  {
    id: "empleados",
    label: "Empleados",
    description: "Relación de empleados con cargo, rol y centro de costo.",
    table: "Empleados",
    defaultKey: "empleadoid",
    columns: [
      "empleadoid",
      "rolid",
      "idEstadoEmpleado",
      "idCargoEmpleado",
      "empresaid",
      "centrocostoid",
    ],
  },
  {
    id: "usuarios",
    label: "Usuarios",
    description: "Usuarios del sistema y autenticación",
    table: "Usuarios",
    defaultKey: "usuarioid",
    columns: [
      "usuarioid",
      "clave",
      "ip",
      "sesion",
      "ultimavez",
      "estado",
      "fechaexpiracion",
      "fechacreacion",
      "bloqueado",
      "cambiarclave",
      "idFirma",
      "loginExterno",
      "tipousuarioid",
      "claveTemporal",
      "RutEmpresa",
      "rolid",
      "centrocostoid",
      "ultimavezLoginEn",
      "dateChangePass",
      "deshabilitado",
      "intentosLogin",
      "ultimoCambioClave",
      "nombreusuario",
    ],
  },
];

export function getSqlTablePreset(id: string): SqlTablePreset | undefined {
  return SQL_TABLE_PRESETS.find((preset) => preset.id === id);
}

export function isCustomTablePreset(id: string): boolean {
  return id === CUSTOM_TABLE_PRESET_ID;
}
