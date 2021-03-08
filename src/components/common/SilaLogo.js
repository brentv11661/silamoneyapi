import React from 'react';
import PropTypes from 'prop-types';

const SilaLogo = ({fill = '#000', className = '', ...rest}) => (
  <svg className={className} viewBox={`0 0 80 42`} xmlns="http://www.w3.org/2000/svg" {...rest}>
    <g fill={fill} fillRule="evenodd">
      <path d="M18.196 13.15h5.31c0-3.19-1.505-6.174-4.136-8.21-.364-.329-1.24-1.031-2.574-1.59l-.366 5.99c1.127 1.016 1.766 2.378 1.766 3.81M24.933 27.6c-1.236-4.198-4.78-7.15-10.25-8.534-.348-.088-.7-.174-1.055-.26-4.503-1.1-6.51-1.863-6.83-4.555-.244-2.044.608-4.077 2.12-5.09l-.373-5.715c-.791.322-1.616.745-2.47 1.293-3.248 2.09-5.035 6.062-4.552 10.12.35 2.947 1.829 5.219 4.394 6.751 1.984 1.186 4.348 1.763 6.434 2.273.34.082.677.165 1.01.249 3.6.912 5.778 2.569 6.471 4.925.45 1.53.257 2.968-.575 4.275-1.053 1.655-3.006 2.866-5.225 3.239-2.269.38-4.52-.189-6.174-1.564-1.642-1.365-2.547-3.35-2.547-5.59H0c0 3.752 1.616 7.247 4.433 9.588 2.284 1.898 5.19 2.913 8.217 2.913.753 0 1.514-.063 2.274-.19 3.686-.62 6.988-2.72 8.832-5.618 1.623-2.55 2.04-5.572 1.176-8.51" />
      <path d="M12.689 12.715c-1.048 0-1.897-.836-1.897-1.868V1.868c0-1.032.85-1.868 1.897-1.868 1.047 0 1.896.836 1.896 1.868v8.979c0 1.032-.849 1.868-1.896 1.868M42.214 41.627A2.471 2.471 0 0141 39.512V4h5.13v31.498l4.586-2.21L53 37.743l-8.293 3.997a2.628 2.628 0 01-2.493-.113zM30 42h5V21h-5zM32.5 16c-1.93 0-3.5-1.57-3.5-3.5S30.57 9 32.5 9s3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5M66.734 36.929c-4.299 0-7.797-3.566-7.797-7.948 0-4.383 3.498-7.948 7.797-7.948 4.3 0 7.798 3.565 7.798 7.948 0 4.382-3.498 7.948-7.798 7.948zm8.329-20.805v3.045C72.828 17.195 69.916 16 66.734 16 59.713 16 54 21.823 54 28.98c0 7.158 5.713 12.981 12.734 12.981 3.182 0 6.094-1.195 8.329-3.169V42H80V16.124h-4.937z" />
    </g>
  </svg>
);

SilaLogo.propTypes = {
  /**
   * The fill color value.
   */
  fill: PropTypes.string,
  /**
   * The classes applied to the SVG DOM element.
   */
  className: PropTypes.any
};

export default SilaLogo;
