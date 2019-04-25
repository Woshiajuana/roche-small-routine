
import Config                   from 'config/env.config'

export default (name) => `${Config.IMAGE_URL}${name}`;
