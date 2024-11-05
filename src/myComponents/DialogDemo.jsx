import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  // DialogDescription,
  // DialogFooter,
  // DialogHeader,
  // DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"

export function DialogDemo({ button, html }) {
  return (
    <>
      <style jsx>{`
        button {
          color: black !important;
        },
        #radix-:r3:{
          backgorund-color: red;
      `}</style>

      <div>
        <Dialog>
          <DialogTrigger asChild>
            {/* <Button variant="outline">Edit Profile</Button> */}
            {button}
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] !bg-white">
            {html}
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}


// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Popover as UIPopover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import PropTypes from "prop-types";

// const DimensionInput = ({ id, label, defaultValue }) => (
//   <div className="grid grid-cols-3 items-center gap-4">
//     <Label htmlFor={id} className="text-sm font-medium text-gray-700">
//       {label}
//     </Label>
//     <Input
//       id={id}
//       defaultValue={defaultValue}
//       className="col-span-2 h-10 px-2 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
//     />
//   </div>
// );

// DimensionInput.propTypes = {
//   id: PropTypes.string.isRequired,
//   label: PropTypes.string.isRequired,
//   defaultValue: PropTypes.string
// };

// export function CustomPopover({
//   triggerButton = <Button variant="outline" className="text-red-500 border-red-500 hover:bg-red-50">Open Settings</Button>,
//   inputs = [
//     { id: "width", label: "Width", defaultValue: "100%" },
//     { id: "maxWidth", label: "Max. width", defaultValue: "300px" },
//     { id: "height", label: "Height", defaultValue: "25px" },
//     { id: "maxHeight", label: "Max. height", defaultValue: "none" }
//   ],
//   content = null
// }) {
//   return (
//     <UIPopover>
//       <PopoverTrigger asChild>
//         {triggerButton}
//       </PopoverTrigger>
//       <PopoverContent className="w-full sm:w-80 bg-red-50 border border-red-300 shadow-lg rounded-lg p-6 text-red-900 transition-all duration-200 transform translate-x-0 sm:translate-x-4">
//         <div className="grid gap-4">
//           {content ? (
//             <div className="custom-content">{content}</div>
//           ) : (
//             <>
//               <div className="space-y-1">
//                 <h4 className="text-lg font-semibold">Dimensions</h4>
//                 <p className="text-sm text-gray-600">
//                   Set the dimensions for the layer.
//                 </p>
//               </div>
//               <div className="grid gap-3">
//                 {inputs.map((input) => (
//                   <DimensionInput
//                     key={input.id}
//                     id={input.id}
//                     label={input.label}
//                     defaultValue={input.defaultValue}
//                   />
//                 ))}
//               </div>
//               <div className="pt-4 text-right">
//                 <Button variant="solid" className="bg-red-500 hover:bg-red-600 text-white">
//                   Save
//                 </Button>
//               </div>
//             </>
//           )}
//         </div>
//       </PopoverContent>
//     </UIPopover>
//   );
// }

// CustomPopover.propTypes = {
//   triggerButton: PropTypes.node,
//   inputs: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.string.isRequired,
//       label: PropTypes.string.isRequired,
//       defaultValue: PropTypes.string
//     })
//   ),
//   content: PropTypes.node
// };
