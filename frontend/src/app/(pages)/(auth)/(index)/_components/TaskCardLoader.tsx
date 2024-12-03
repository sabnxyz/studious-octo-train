export const TaskCardLoader = () => {
  return (
    <div className="p-2 animate-pulse bg-white rounded-xl">
      <div className="flex justify-between items-center h-6">
        <p className="font-semibold bg-gray-200 h-4 rounded-md w-8"></p>
        <div className="bg-gray-200 h-4 w-14 rounded-md"></div>
      </div>
      <div className="mt-2">
        <div className="line-clamp-2 w-2/5 h-7 bg-gray-200 rounded-md"></div>
        <div className="text-gray-300 w-4/5 text-sm h-6 bg-gray-200 rounded-md mt-1"></div>
      </div>
      <div className="mt-5 pt-3 flex gap-2 opacity-70 border-t border-gray-100">
        <div className="h-6 rounded-md w-10 bg-gray-200"></div>
        <div className="h-6 rounded-md w-10 bg-gray-200"></div>
      </div>
    </div>
  );
};
