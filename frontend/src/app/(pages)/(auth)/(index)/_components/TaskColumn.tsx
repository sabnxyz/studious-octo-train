import { useState } from "react";
import ITask from "../../../../../../../backend/src/interfaces/ITask";
import { DateRange } from "react-day-picker";
import { useDroppable } from "@dnd-kit/core";
import { format, isWithinInterval, parseISO, startOfDay } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  CalendarClock,
  CalendarPlus,
  ChartNoAxesColumnIncreasing,
  Filter,
  Ghost,
  Plus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TaskCard } from "./TaskCard";
import { TaskCardLoader } from "./TaskCardLoader";
import { cn } from "@/lib/utils/cn";

export const TaskColumn = ({
  status,
  data,
  isLoading,
  index,
}: {
  status: string;
  data: Array<ITask>;
  isLoading: boolean;
  index: number;
}) => {
  const [sortBy, setSortBy] = useState("custom");
  const [sortOrder, setSortOrder] = useState("asc");

  const [selectedPriorities, setSelectedPriorities] = useState([] as string[]);
  const [dueDateRange, setDueDateRange] = useState<DateRange | undefined>(
    undefined
  );
  const [createdDateRange, setCreatedDateRange] = useState<
    DateRange | undefined
  >(undefined);

  const { setNodeRef } = useDroppable({
    id: status,
  });

  const handlePrioritiesChange = (checked: boolean, priority: string) => {
    if (checked) {
      setSelectedPriorities([...selectedPriorities, priority]);
    } else {
      setSelectedPriorities(selectedPriorities.filter((p) => p !== priority));
    }
  };

  // apply all selected filters and sorting to our data and use it to render the tasks
  const filteredData = data
    .sort((a, b) => {
      const firstItem = sortOrder === "asc" ? a : b;
      const secondItem = sortOrder === "asc" ? b : a;

      if (sortBy === "due") {
        const defaultDate = new Date(0);

        const firstDueDate = firstItem.due
          ? new Date(firstItem.due)
          : defaultDate;
        const secondDueDate = secondItem.due
          ? new Date(secondItem.due)
          : defaultDate;

        return firstDueDate.getTime() - secondDueDate.getTime();
      } else if (sortBy === "created_at") {
        return (
          new Date(firstItem.created_at).getTime() -
          new Date(secondItem.created_at).getTime()
        );
      } else if (sortBy === "task_id") {
        return Number(firstItem.task_id) - Number(secondItem.task_id);
      } else if (sortBy === "custom") {
        const firstIndex =
          firstItem.index !== null ? Number(firstItem.index) : Infinity;
        const secondIndex =
          secondItem.index !== null ? Number(secondItem.index) : Infinity;

        if (firstIndex !== secondIndex) {
          return firstIndex - secondIndex;
        } else {
          // If index values are the same, compare index_updated_at dates
          const firstUpdatedAt = new Date(
            firstItem.index_updated_at!
          ).getTime();
          const secondUpdatedAt = new Date(
            secondItem.index_updated_at!
          ).getTime();
          return secondUpdatedAt - firstUpdatedAt; // Latest date comes first
        }
      }

      return undefined as unknown as number;
    })
    .filter((task) => {
      const priorityCondition =
        selectedPriorities.length > 0
          ? selectedPriorities.includes(task.priority)
          : true;

      const dueDateCondition = dueDateRange
        ? !task.due
          ? false
          : dueDateRange.to
          ? isWithinInterval(startOfDay(parseISO(task.due)), {
              start: startOfDay(
                parseISO(dueDateRange.from?.toISOString() || "")
              ),
              end: startOfDay(parseISO(dueDateRange.to?.toISOString() || "")),
            })
          : startOfDay(parseISO(task.due)).getTime() ===
            startOfDay(
              parseISO(dueDateRange.from?.toISOString() || "")
            ).getTime()
        : true;

      const createdDateCondition = createdDateRange
        ? createdDateRange.to
          ? isWithinInterval(startOfDay(parseISO(task.created_at)), {
              start: startOfDay(
                parseISO(createdDateRange.from?.toISOString() || "")
              ),
              end: startOfDay(
                parseISO(createdDateRange.to?.toISOString() || "")
              ),
            })
          : startOfDay(parseISO(task.created_at)).getTime() ===
            startOfDay(
              parseISO(createdDateRange.from?.toISOString() || "")
            ).getTime()
        : true;

      return priorityCondition && dueDateCondition && createdDateCondition;
    });

  const isEmptyTaskList = filteredData.length === 0 && !isLoading;
  const isFiltersApplied =
    Boolean(dueDateRange) ||
    Boolean(createdDateRange) ||
    selectedPriorities.length > 0;

  const resetFilters = () => {
    setSelectedPriorities([]);
    setDueDateRange(undefined);
    setCreatedDateRange(undefined);
  };

  return (
    <div className="bg-gray-100 rounded-xl h-full relative overflow-y-auto overflow-x-hidden">
      <div className="bg-gray-100 p-3 flex justify-between items-center sticky top-0 z-10">
        <p className="text-gray-700 font-semibold capitalize">{status}</p>
        <div className="flex items-center gap-4">
          {isFiltersApplied && (
            <Button
              size="sm"
              variant={"outline"}
              onClick={() => resetFilters()}
            >
              <span>Clear filters</span>
              <Plus className="rotate-45" />
            </Button>
          )}
          {sortBy && (
            <span className="text-xs font-medium text-gray-400">
              Sorted by:{sortBy}
            </span>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="outline-none">
                <Filter className="size-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="capitalize">
                <span>Filter {status} Tasks</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <ChartNoAxesColumnIncreasing className="size-4" />
                  <span>Priority</span>
                  {selectedPriorities.length > 0 && (
                    <span className="text-xs mt-0.5 bg-purple-100 px-2 py-1 rounded capitalize">
                      ({selectedPriorities.map((p) => p[0]).join(", ")})
                    </span>
                  )}
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {["high", "medium", "low"].map((priority) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={priority}
                          checked={selectedPriorities.includes(priority)}
                          onCheckedChange={(checked) => {
                            handlePrioritiesChange(checked, priority);
                          }}
                          className="capitalize"
                        >
                          {priority}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="items-center">
                  <CalendarClock className="size-4" />
                  <span>Due date</span>
                  {dueDateRange && (
                    <span className="text-xs mt-0.5 bg-purple-100 px-2 py-1 rounded">
                      (
                      {[
                        dueDateRange?.from &&
                          format(dueDateRange.from, "dd/MM"),
                        dueDateRange?.to && format(dueDateRange.to, "dd/MM"),
                      ]
                        .filter(Boolean)
                        .join(" - ")}
                      )
                    </span>
                  )}
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <Calendar
                      mode="range"
                      selected={dueDateRange}
                      onSelect={setDueDateRange}
                      disabled={(date) =>
                        date <
                          new Date(
                            new Date().setDate(new Date().getDate() - 1)
                          ) || date < new Date("1900-01-01")
                      }
                    />
                    {dueDateRange && (
                      <div className="grid place-items-center">
                        <Button
                          variant="secondary"
                          className="text-sm font-semibold w-[95%] mb-2"
                          onClick={() => setDueDateRange(undefined)}
                        >
                          Clear
                        </Button>
                      </div>
                    )}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="items-center">
                  <CalendarPlus className="size-4" />
                  <span>Created date</span>
                  {createdDateRange && (
                    <span className="text-xs mt-0.5 bg-purple-100 px-2 py-1 rounded">
                      (
                      {[
                        createdDateRange?.from &&
                          format(createdDateRange.from, "dd/MM"),
                        createdDateRange?.to &&
                          format(createdDateRange.to, "dd/MM"),
                      ]
                        .filter(Boolean)
                        .join(" - ")}
                      )
                    </span>
                  )}
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <Calendar
                      mode="range"
                      selected={createdDateRange}
                      onSelect={setCreatedDateRange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                    />
                    {createdDateRange && (
                      <div className="grid place-items-center">
                        <Button
                          variant="secondary"
                          className="text-sm font-semibold w-[95%] mb-2"
                          onClick={() => setCreatedDateRange(undefined)}
                        >
                          Clear
                        </Button>
                      </div>
                    )}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="capitalize">
                <span>Sort by</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="border-0 p-0 px-2">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom">Custom</SelectItem>
                  <SelectItem value="task_id">Task ID</SelectItem>
                  <SelectItem value="created_at">Created Date</SelectItem>
                  <SelectItem value="due">Due Date</SelectItem>
                </SelectContent>
              </Select>
              {sortBy !== "custom" && (
                <DropdownMenuRadioGroup
                  value={sortOrder}
                  onValueChange={setSortOrder}
                >
                  <DropdownMenuRadioItem value="asc">Asc</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="desc">
                    Desc
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <SortableContext
        id={status}
        items={data.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className={cn(
            "p-2 flex flex-col gap-2",
            isEmptyTaskList && "grid place-items-center h-[80%]"
          )}
        >
          {isEmptyTaskList && (
            <div className="flex flex-col justify-center items-center gap-3">
              <Ghost className="size-12 text-gray-600" />
              <p>No tasks here yet.</p>
              {isFiltersApplied && (
                <p className="text-sm -mt-2 text-gray-400">
                  Note: Filters are applied
                </p>
              )}
            </div>
          )}
          {isLoading &&
            Array(3 - (index % 2 === 0 ? 0 : 1))
              .fill(" ")
              .map((el, i) => <TaskCardLoader key={i} />)}

          {filteredData.map((task) => {
            return <TaskCard key={task.id} task={task} />;
          })}
        </div>
      </SortableContext>
    </div>
  );
};
