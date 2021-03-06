import { createElement } from 'react';
import MethodLabel from 'src/components/MethodLabel';
import * as style from './style.scss';

interface Props {
  method: HttpMethod;
  path: string;
}

function OperationPath(props: Props) {
  const { method, path } = props;

  return (
    <div className={style.container}>
      <MethodLabel method={method} className={style.method} />
      <span className={style.path}>{path}</span>
    </div>
  );
}

export default OperationPath;
