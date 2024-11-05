import React, { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const ComboboxForm = ({
  options = [],
  onSelect,
  placeholder = "Select an option",
  label = "Select",
  description,
  selectedValue,
  setSelectedValue,
}) => {
  
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Update selected value when options change
  useEffect(() => {
    if (options.length > 0 && !selectedValue) {
      setSelectedValue(options[0].value);
    }
  }, [options]);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedValue) {
      setError('Please select an option.');
      return;
    }

    if (onSelect) {
      onSelect(selectedValue);
    }
  };

  const handleSelect = (option) => {
    setSelectedValue(option.value);
    setError('');
    setIsDialogOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="w-full max-w-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">{label}</label>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button
                type="button"
                className="w-full px-3 py-2 text-left border rounded-md shadow-sm 
                         flex items-center justify-between bg-white
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span className={!selectedValue ? 'text-gray-500' : '!text-black'}>
                  {selectedValue
                    ? options.find(opt => opt.value === selectedValue)?.label
                    : placeholder}
                </span>
                <ChevronsUpDown className="h-4 w-4 text-gray-500" />
              </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{label}</DialogTitle>
                <DialogDescription>
                  {description || `Select a ${label.toLowerCase()} from the list below.`}
                </DialogDescription>
              </DialogHeader>

              <div className="p-2 border-b">
                <div className="flex items-center px-2 py-1 bg-gray-50 rounded-md">
                  <Search className="h-4 w-4 text-gray-500 mr-2" />
                  {/* <Input type="text" placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  /> */}
                  <input
                    type="text"
                    className="w-full bg-transparent focus:outline-none text-sm py-1"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="max-h-[300px] overflow-auto !bg-black">
                {filteredOptions.length === 0 ? (
                  <div className="px-2 py-3 text-sm text-gray-500 text-center">
                    No options found.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-1">
                    {filteredOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className="w-full px-2 py-2 text-left flex items-center 
                          bg-white
                          !text-black
                          hover:text-white
                                focus:outline-none
                                rounded-md"
                        onClick={() => handleSelect(option)}
                      >
                        <span className="w-4 h-4 mr-2 flex items-center justify-center">
                          {option.value === selectedValue && (
                            <Check className="h-4 w-4 text-blue-500" />
                          )}
                        </span>
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
        </div>

        {/* <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-500 rounded-md
                   hover:bg-blue-600 focus:outline-none focus:ring-2 
                   focus:ring-blue-500 focus:ring-offset-2"
        >
          Submit
        </button> */}
      </form>
    </div>
  );
};

export default ComboboxForm;