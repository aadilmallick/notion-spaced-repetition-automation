# Read each line and split on first '=' only
while IFS='=' read -r name value
do
    # Trim leading/trailing whitespace from name
    name="$(echo -e "${name}" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')"
    
    # Store in arrays, preserving spaces in value
    arr_names+=("$name")
    arr_values+=("$value")
done < .env

for ((i = 0; i < ${#arr_names[@]}; i++))
do
    echo "first value is ${arr_names[i]} and second value is ${arr_values[i]}"
    # Check if value contains spaces
    if [[ "${arr_values[i]}" == *" "* ]]; then
        gh secret set "${arr_names[i]}"
    fi
    gh secret set ${arr_names[i]} --body ${arr_values[i]}
    echo "set secret ${arr_names[i]} with value ${arr_values[i]}"
    echo "--------------------------------"
done
