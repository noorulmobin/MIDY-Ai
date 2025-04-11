import "spinkit/spinkit.min.css";
/**
 * Loading Effect
 * @param props
 * @returns
 */
const SKChaseLoading = (props: { loading: boolean }) => {
  const { loading } = props;

  return loading ? (
    <div className="absolute bottom-0 left-0 right-0 top-0 flex h-full w-full flex-col justify-center rounded-2xl bg-slate-300 opacity-35">
      <div className="sk-chase m-auto">
        <div className="sk-chase-dot dark:before:bg-white"></div>
        <div className="sk-chase-dot dark:before:bg-white"></div>
        <div className="sk-chase-dot dark:before:bg-white"></div>
        <div className="sk-chase-dot dark:before:bg-white"></div>
        <div className="sk-chase-dot dark:before:bg-white"></div>
        <div className="sk-chase-dot dark:before:bg-white"></div>
      </div>
    </div>
  ) : null;
};
export default SKChaseLoading;
