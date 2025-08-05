import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Search, Check } from 'lucide-react'

interface CollegeCodeDropdownProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  placeholder?: string
  className?: string
}

const COLLEGE_CODES = [
  "msu305", "aluau41", "mku629", "per169", "mku201", "per199", "MKU656", "msu130", "mku621sf1", "mku624", "aluau56", "per157", "per200", "per135", "per210", "per159", "per172", "per156", "aluau58", "msu320", "mku309", "per127", "bru06", "mku211", "msu133", "mtu8", "per102", "per174", "per183", "per151", "msu201", "per155", "per113", "per101", "per142", "msu207", "per106", "msu127", "msu129", "msu131", "bru11", "msu210", "MKU658", "bru09", "msu117", "mku302", "mku604", "per103", "bru01", "per105", "per104", "mku259", "per185", "mku628dfc", "mtu6", "aluau16", "msu311", "per177", "aluau03", "msu102", "per176", "per130", "bru15", "per122", "msu106", "per203", "per165", "msu319", "per188", "per124", "aluau44", "per145", "per189", "mku251", "mku205", "per119", "per192", "mku263", "aluau02", "mku618", "msu313", "mku256", "mku324", "MKU605SFC", "mtu5", "per193", "bru1021008", "aluau05", "aluau20", "msu107", "aluau18", "per141", "per126", "msu302", "msu123", "per117", "msu219", "bru17", "bruau", "mtu7", "aluau15", "per197", "brubu", "mku616sfc", "msu125", "msu202", "per161", "per178", "per152", "per133", "per160", "per121", "msu309", "msu328", "msu308", "mku619", "per206", "msu327", "alu6", "msu307", "msu214", "per128", "msu223", "per209", "msu135", "per187", "per138", "per205", "mku603", "per168", "per137", "aluau14", "per196", "msu310", "msu140", "per158", "msu325", "MKU623SFC", "mtu3", "msu132", "per211", "aluau57", "mku622", "mku625", "bruaq", "mku620", "bru0012", "per163", "mku640", "mku216", "aluau19", "aluau51", "mku206", "bru4i", "bru07", "MKU637", "mku633", "bruam", "mku634", "mku609", "bru26", "msu228", "msu109", "mku235", "per219", "mku284", "mku621", "msu301", "mtu4", "msu315", "aluau60", "mku249", "per140", "per215", "mtu2", "aluau07", "per164", "mku636", "aluau22", "aluau01", "mku242", "per207", "mtu9", "per125", "aluau04", "aluau55", "aluau63", "per173", "per186", "aluau08", "per111", "per194", "msu115", "bru5h", "per162", "bru3k", "unm1311", "bdu2", "unm117", "per179", "unm1697", "bdu3", "tvu206", "tvu310", "anm201", "tvu312", "bdu132", "tvu321", "PER195", "unm1319", "unm1711", "unm1725", "unm1325", "unm189", "bdu97", "msu323", "anm121", "unm1321", "unm1303", "bdu263", "anm105", "anm412", "tvu318", "tvu201", "bdu401", "per202", "per146", "tvu367", "bru4w", "anm108", "msu330", "bdu023", "bdu081", "aluau54", "bdu17", "bdu6", "bdu398", "anm103", "anm206", "mtu1", "aluau17", "tvu204", "msu137", "anm222", "tvu304", "unm111", "tvu374", "anm104", "unm1439", "tvu231", "unm1353", "anm216", "anm102", "bdu134", "bdu12", "bdu1", "tvu247", "tvu346", "bdu79", "anm303", "bdu160", "bdu340", "unm123", "bdu30", "tvu323", "mku644", "bru27", "tvu244", "msu208", "anm301", "bdu180", "BDU316", "unm1435", "bdu452", "bdu402", "per214", "bdu528", "bdu78", "anm202", "bdu595", "mku332", "BDU774", "msu318", "bruah", "bruab", "per208", "brubd", "bru3d", "per218", "bru4y", "bru4q", "bruaj", "bru36", "bru4z", "bru4j", "per131", "bru12", "bru4x", "bru5b", "bru34", "per132", "bru28", "per148", "bru3j", "bruaa", "BRU31", "per204", "per145", "per189", "per195", "per220", "per162"
]

const CollegeCodeDropdown: React.FC<CollegeCodeDropdownProps> = ({
  value,
  onChange,
  disabled = false,
  placeholder = "Select or type college code",
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [inputValue, setInputValue] = useState(value)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const optionsRef = useRef<(HTMLButtonElement | null)[]>([])

  // Filter college codes based on search term
  const filteredCodes = COLLEGE_CODES.filter(code =>
    code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm('')
        setFocusedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Update input value when prop value changes
  useEffect(() => {
    setInputValue(value)
  }, [value])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setFocusedIndex(prev => 
            prev < filteredCodes.length - 1 ? prev + 1 : 0
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setFocusedIndex(prev => 
            prev > 0 ? prev - 1 : filteredCodes.length - 1
          )
          break
        case 'Enter':
          e.preventDefault()
          if (focusedIndex >= 0 && focusedIndex < filteredCodes.length) {
            handleSelectCode(filteredCodes[focusedIndex])
          }
          break
        case 'Escape':
          setIsOpen(false)
          setFocusedIndex(-1)
          inputRef.current?.focus()
          break
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, focusedIndex, filteredCodes])

  // Scroll focused option into view
  useEffect(() => {
    if (focusedIndex >= 0 && optionsRef.current[focusedIndex]) {
      optionsRef.current[focusedIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      })
    }
  }, [focusedIndex])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    setSearchTerm(newValue)
    onChange(newValue)
    setFocusedIndex(-1)
    if (!isOpen) {
      setIsOpen(true)
    }
  }

  const handleSelectCode = (code: string) => {
    setInputValue(code)
    onChange(code)
    setIsOpen(false)
    setSearchTerm('')
    setFocusedIndex(-1)
    inputRef.current?.focus()
  }

  const toggleDropdown = () => {
    if (!disabled) {
      if (!isOpen) {
        setSearchTerm(inputValue)
        setFocusedIndex(-1)
      }
      setIsOpen(!isOpen)
    }
  }

  const handleInputFocus = () => {
    if (!disabled && !isOpen) {
      setIsOpen(true)
      setSearchTerm(inputValue)
    }
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className={`relative ${className}`} ref={dropdownRef}>
        {/* Modern Input Field */}
        <div className="relative group">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            disabled={disabled}
            className={`
              w-full px-4 py-3 pr-12
              bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-500
              border-2 border-yellow-200
              rounded-2xl
              text-white font-medium
              placeholder-black/50
              shadow-lg shadow-yellow-200/50
              transition-all duration-300 ease-out
              focus:border-blue-400 focus:shadow-xl focus:shadow-blue-200/30
              focus:scale-[1.02]
              hover:border-yellow-300 hover:shadow-xl
              ${disabled ? 
                'bg-gray-400/60 cursor-not-allowed opacity-60 text-gray-500' : 
                'group-hover:border-yellow-300'
              }
              ${isOpen ? 'border-blue-400 shadow-xl shadow-blue-200/30 scale-[1.02]' : ''}
            `}
            placeholder={placeholder}
            autoComplete="off"
          />
          
          {/* Dropdown Toggle Button */}
          <button
            type="button"
            onClick={toggleDropdown}
            disabled={disabled}
            className={`
              absolute right-3 top-1/2 -translate-y-1/2
              p-1 rounded-lg
              transition-all duration-200
              ${disabled ? 
                'text-gray-400 cursor-not-allowed' : 
                'text-gray-500 hover:text-blue-500 hover:bg-blue-50'
              }
            `}
          >
            <ChevronDown 
              className={`h-5 w-5 transition-transform duration-300 ${
                isOpen ? 'rotate-180 text-blue-500' : ''
              }`} 
            />
          </button>

          {/* Focus Ring */}
          <div className={`
            absolute inset-0 rounded-2xl pointer-events-none
            transition-all duration-300
            ${isOpen || inputRef.current === document.activeElement ? 
              'ring-4 ring-blue-100 ring-opacity-60' : ''
            }
          `} />
        </div>

        {/* Modern Dropdown Menu */}
        {isOpen && !disabled && (
          <div className="absolute left-0 right-0 mt-2 z-[9999]">
            <div className="
              bg-white 
              border border-gray-200 
              rounded-2xl 
              shadow-2xl shadow-gray-300/20
              backdrop-blur-sm
              overflow-hidden
              animate-in slide-in-from-top-2 duration-200
            ">
              {/* Search Header */}
              <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value)
                      setFocusedIndex(-1)
                    }}
                    placeholder="Search college codes..."
                    className="
                      w-full pl-10 pr-4 py-2.5
                      bg-white
                      border border-gray-200
                      rounded-xl
                      text-gray-700
                      placeholder-gray-400
                      focus:border-blue-300 focus:ring-2 focus:ring-blue-100
                      focus:outline-none
                      transition-all duration-200
                    "
                    autoFocus
                  />
                </div>
              </div>
              
              {/* Options List */}
              <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {filteredCodes.length > 0 ? (
                  <div className="p-2">
                    {filteredCodes.map((code, index) => (
                      <button
                        key={code}
                        ref={el => optionsRef.current[index] = el}
                        type="button"
                        onClick={() => handleSelectCode(code)}
                        onMouseEnter={() => setFocusedIndex(index)}
                        className={`
                          w-full text-left px-4 py-3 rounded-xl
                          font-medium text-gray-700
                          transition-all duration-150
                          flex items-center justify-between
                          group
                          ${focusedIndex === index ? 
                            'bg-blue-50 text-blue-700 shadow-md transform scale-[1.02]' : 
                            'hover:bg-gray-50'
                          }
                          ${value === code ? 
                            'bg-blue-100 text-blue-800 shadow-md' : ''
                          }
                        `}
                      >
                        <span className="font-mono tracking-wide">{code}</span>
                        {value === code && (
                          <Check className="h-4 w-4 text-blue-600" />
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <div className="text-gray-400 mb-2">
                      <Search className="h-8 w-8 mx-auto opacity-50" />
                    </div>
                    <p className="text-gray-500 font-medium">No college codes found</p>
                    <p className="text-gray-400 text-sm mt-1">Try a different search term</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              {filteredCodes.length > 0 && (
                <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
                  <p className="text-xs text-gray-500 text-center">
                    {filteredCodes.length} code{filteredCodes.length !== 1 ? 's' : ''} found
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CollegeCodeDropdown