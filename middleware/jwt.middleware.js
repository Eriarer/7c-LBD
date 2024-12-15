import jwt from 'jsonwebtoken'

const BLACKLIST = []

export const generateToken = ({
  idusuario,
  nombre,
  apellido,
  correo,
  tipo
}) => {
  return jwt.sign(
    { idusuario, nombre, apellido, correo, tipo },
    process.env.JWT_SECRET,
    {
      expiresIn: '2h'
    }
  )
}

export const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token']
  if (!token) {
    return res
      .status(403)
      .json({ status: 'error', message: 'No se proporcionó una autenticación' })
  }
  if (BLACKLIST.includes(token)) {
    return res.status(403).json({ status: 'error', message: 'Token expirado' })
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        status: 'error',
        message: 'No se proporcionó una autenticación'
      })
    }
    next()
  })
}

// expirar el token proporcionado
export const dropToken = (req, res) => {
  const token = req.headers['x-access-token']
  if (!token) {
    return res
      .status(403)
      .json({ status: 'error', message: 'No se proporcionó una autenticación' })
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        status: 'error',
        message: 'No se proporcionó una autenticación'
      })
    }
    BLACKLIST.push(token)
    return res
      .status(200)
      .json({ status: 'success', message: 'Sesión cerrada con éxito' })
  })
}

export const decodeToken = (req, res, next) => {
  const token = req.headers['x-access-token']
  if (!token) {
    return res
      .status(403)
      .json({ status: 'error', message: 'No se proporcionó una autenticación' })
  }
  if (BLACKLIST.includes(token)) {
    return res.status(403).json({ status: 'error', message: 'Token expirado' })
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        status: 'error',
        message: 'No se proporcionó una autenticación'
      })
    }
    req.user = decoded
    next()
  })
}

export const isAdmin = (req, res, next) => {
  //decodificar token
  const token = req.headers['x-access-token']
  if (!token) {
    return res
      .status(403)
      .json({ status: 'error', message: 'No se proporcionó una autenticación' })
  }
  if (BLACKLIST.includes(token)) {
    return res.status(403).json({ status: 'error', message: 'Token expirado' })
  }
  //el tipo tiene que ser RESPONSABLE o AYUDANTE
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        status: 'error',
        message: 'No se proporcionó una autenticación'
      })
    }
    if (decoded.tipo !== 'RESPONSABLE' && decoded.tipo !== 'AYUDANTE') {
      return res
        .status(403)
        .json({ status: 'error', message: 'Permisos insuficientes' })
    }
    next()
  })
}

export const refreshToken = (req, res, next) => {
  const token = req.headers['x-access-token']
  if (!token) {
    return res
      .status(403)
      .json({ status: 'error', message: 'No se proporcionó una autenticación' })
  }
  if (BLACKLIST.includes(token)) {
    return res.status(403).json({ status: 'error', message: 'Token expirado' })
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        status: 'error',
        message: 'No se proporcionó una autenticación'
      })
    }
    BLACKLIST.push(token)
    req.user = decoded
    next()
  })
}

const viewBlacklist = () => {
  for (const token of BLACKLIST) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        BLACKLIST.splice(BLACKLIST.indexOf(token), 1)
      }
    })
  }
}

setInterval(viewBlacklist, 300000)
